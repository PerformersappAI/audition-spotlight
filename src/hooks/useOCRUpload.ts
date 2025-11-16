import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UploadStatus {
  [fileKey: string]: {
    status: 'pending' | 'processing' | 'done' | 'error';
    result?: any;
    timestamp: number;
  };
}

export type ProcessingStage = 'idle' | 'reading' | 'uploading' | 'processing' | 'extracting' | 'complete';

export const useOCRUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [currentFileSize, setCurrentFileSize] = useState(0);
  
  const uploadStatusRef = useRef<UploadStatus>({});
  const processingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Timer for elapsed time tracking
  useEffect(() => {
    if (isProcessing) {
      startTimeRef.current = Date.now();
      setElapsedTime(0);
      
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsedTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isProcessing]);

  // Generate unique key for file based on name, size, and last modified
  const generateFileKey = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  // Clean up old status entries (older than 5 minutes)
  const cleanupOldEntries = useCallback(() => {
    const now = Date.now();
    const CLEANUP_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    Object.keys(uploadStatusRef.current).forEach(key => {
      if (now - uploadStatusRef.current[key].timestamp > CLEANUP_THRESHOLD) {
        delete uploadStatusRef.current[key];
        if (processingTimeouts.current[key]) {
          clearTimeout(processingTimeouts.current[key]);
          delete processingTimeouts.current[key];
        }
      }
    });
  }, []);

  const processFile = useCallback(async (
    file: File,
    onSuccess: (result: any) => void,
    onError?: (error: string) => void
  ) => {
    const fileKey = generateFileKey(file);
    
    // Clean up old entries
    cleanupOldEntries();

    // Check if file is already being processed or completed
    const existingStatus = uploadStatusRef.current[fileKey];
    if (existingStatus) {
      switch (existingStatus.status) {
        case 'processing':
          toast({
            title: "File Already Processing",
            description: `${file.name} is already being processed. Please wait...`,
            variant: "default"
          });
          return;
        
        case 'done':
          if (existingStatus.result) {
            console.log('Using cached result for:', fileKey);
            onSuccess(existingStatus.result);
            return;
          }
          break;
          
        case 'error':
          // Allow retry after error, but clear the status
          delete uploadStatusRef.current[fileKey];
          break;
      }
    }

    try {
      // Mark as processing
      uploadStatusRef.current[fileKey] = {
        status: 'processing',
        timestamp: Date.now()
      };

      setCurrentFileName(file.name);
      setCurrentFileSize(file.size);
      setIsProcessing(true);
      setCurrentStage('reading');
      setProgress(5);

      if (file.type === "text/plain" || file.type === "text/csv") {
        setProgress(50);
        const text = await file.text();
        setProgress(90);
        const result = { text, type: file.type === "text/csv" ? "csv" : "text" };
        
        // Mark as done and cache result
        uploadStatusRef.current[fileKey] = {
          status: 'done',
          result,
          timestamp: Date.now()
        };
        
        setCurrentStage('complete');
        setProgress(100);
        onSuccess(result);
        toast({
          title: "Success",
          description: `${file.type === "text/csv" ? 'CSV' : 'Text'} file loaded successfully`
        });
        
        // Cleanup with delay to show completion state
        setTimeout(() => {
          setIsProcessing(false);
          setCurrentStage('idle');
          setProgress(0);
          setCurrentFileName('');
          setCurrentFileSize(0);
        }, 1500);
        
      } else if (
        file.type === "application/pdf" || 
        file.type === "image/jpeg" || 
        file.type === "image/jpg" || 
        file.type === "image/png" ||
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setProgress(10);

        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            setCurrentStage('uploading');
            setProgress(20);
            
            const base64Data = e.target?.result as string;
            const base64Content = base64Data.split(',')[1];
            
            setProgress(30);
            console.log(`[OCR] Processing file: ${file.name} (key: ${fileKey})`);
            
            setCurrentStage('processing');
            setProgress(40);
            
            // Add idempotency header using file key
            const { data, error } = await supabase.functions.invoke('parse-document', {
              body: { 
                fileData: base64Content,
                fileName: file.name,
                mimeType: file.type,
                idempotencyKey: fileKey // Add idempotency key
              }
            });
            
            setProgress(70);
            
            if (error) {
              console.error('[OCR] Document parsing error:', error);
              
              // Mark as error
              uploadStatusRef.current[fileKey] = {
                status: 'error',
                timestamp: Date.now()
              };
              
              const errorMessage = error.message || error.toString();
              
              if (errorMessage.includes('temporarily overloaded') || errorMessage.includes('try again')) {
                toast({
                  title: "Service Temporarily Unavailable",
                  description: "AI service is busy. Please try uploading again in a few moments.",
                  variant: "destructive"
                });
              } else if (errorMessage.includes('Invalid MIME type') || errorMessage.includes('image types')) {
                toast({
                  title: "PDF Processing Issue",
                  description: "Trying alternative PDF processing method. Please wait...",
                  variant: "default"
                });
              } else {
                toast({
                  title: "PDF Processing Failed",
                  description: errorMessage.length > 100 ? "Unable to process PDF file. Please try a different file." : errorMessage,
                  variant: "destructive"
                });
              }
              
              onError?.(errorMessage);
              
              // Cleanup immediately on error
              setIsProcessing(false);
              setCurrentStage('idle');
              setProgress(0);
              setCurrentFileName('');
              setCurrentFileSize(0);
              return;
            }
            
            if (data?.text && data.text.trim()) {
              console.log(`[OCR] Successfully processed: ${file.name}`);
              
              setCurrentStage('extracting');
              setProgress(85);
              
              // Mark as done and cache result
              uploadStatusRef.current[fileKey] = {
                status: 'done',
                result: data,
                timestamp: Date.now()
              };
              
              setCurrentStage('complete');
              setProgress(100);
              
              onSuccess(data);
              toast({
                title: "Success",
                description: file.type === "application/pdf" ? "PDF text extracted successfully!" : "Image text extracted successfully!"
              });
              
              // Cleanup with delay to show completion state
              setTimeout(() => {
                setIsProcessing(false);
                setCurrentStage('idle');
                setProgress(0);
                setCurrentFileName('');
                setCurrentFileSize(0);
              }, 1500);
            } else {
              const errorMsg = file.type === "application/pdf" 
                ? "No readable text found in PDF. Please check if the file contains text or try a different format."
                : "No readable text found in image. Please check if the image contains text or try a different file.";
              
              // Mark as error
              uploadStatusRef.current[fileKey] = {
                status: 'error',
                timestamp: Date.now()
              };
              
              toast({
                title: "No Text Found",
                description: errorMsg,
                variant: "destructive"
              });
              onError?.(errorMsg);
              
              // Cleanup immediately on error
              setIsProcessing(false);
              setCurrentStage('idle');
              setProgress(0);
              setCurrentFileName('');
              setCurrentFileSize(0);
            }
          } catch (parseError) {
            console.error('[OCR] Error in PDF processing:', parseError);
            
            // Mark as error
            uploadStatusRef.current[fileKey] = {
              status: 'error',
              timestamp: Date.now()
            };
            
            const errorMsg = parseError instanceof Error ? parseError.message : (file.type === "application/pdf" ? "Failed to extract text from PDF" : "Failed to extract text from image");
            toast({
              title: "Processing Error",
              description: errorMsg,
              variant: "destructive"
            });
            onError?.(errorMsg);
            
            // Cleanup immediately on error
            setIsProcessing(false);
            setCurrentStage('idle');
            setProgress(0);
            setCurrentFileName('');
            setCurrentFileSize(0);
          }
        };
        
        reader.onerror = () => {
          // Mark as error
          uploadStatusRef.current[fileKey] = {
            status: 'error',
            timestamp: Date.now()
          };
          
          toast({
            title: "File Read Error",
            description: file.type === "application/pdf" ? "Failed to read PDF file" : "Failed to read image file",
            variant: "destructive"
          });
          onError?.(file.type === "application/pdf" ? "Failed to read PDF file" : "Failed to read image file");
          
          // Cleanup immediately on error
          setIsProcessing(false);
          setCurrentStage('idle');
          setProgress(0);
          setCurrentFileName('');
          setCurrentFileSize(0);
        };
        
        reader.readAsDataURL(file);
        
      } else {
        const errorMsg = "Unsupported file type. Please upload PDF, image (PNG/JPEG), text, CSV, or Excel files.";
        
        // Mark as error
        uploadStatusRef.current[fileKey] = {
          status: 'error',
          timestamp: Date.now()
        };
        
        toast({
          title: "Unsupported File Type",
          description: errorMsg,
          variant: "destructive"
        });
        onError?.(errorMsg);
        
        // Cleanup immediately on error
        setIsProcessing(false);
        setCurrentStage('idle');
        setProgress(0);
        setCurrentFileName('');
        setCurrentFileSize(0);
      }
      
    } catch (error) {
      console.error('[OCR] Error processing file:', error);
      
      // Mark as error
      uploadStatusRef.current[fileKey] = {
        status: 'error',
        timestamp: Date.now()
      };
      
      const errorMsg = error instanceof Error ? error.message : "Failed to process file";
      toast({
        title: "Processing Error",
        description: errorMsg,
        variant: "destructive"
      });
      onError?.(errorMsg);
      
      // Cleanup immediately on error
      setIsProcessing(false);
      setCurrentStage('idle');
      setProgress(0);
      setCurrentFileName('');
      setCurrentFileSize(0);
    }
  }, [cleanupOldEntries]);

  // Get current status for debugging
  const getUploadStatus = useCallback(() => {
    return { ...uploadStatusRef.current };
  }, []);

  // Force clear status for a file (for debugging)
  const clearFileStatus = useCallback((file: File) => {
    const fileKey = generateFileKey(file);
    delete uploadStatusRef.current[fileKey];
  }, []);

  return {
    processFile,
    isProcessing,
    currentStage,
    elapsedTime,
    progress,
    currentFileName,
    currentFileSize,
    getUploadStatus,
    clearFileStatus
  };
};
