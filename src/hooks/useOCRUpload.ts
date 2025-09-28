import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface UploadStatus {
  [fileKey: string]: {
    status: 'pending' | 'processing' | 'done' | 'error';
    result?: any;
    timestamp: number;
  };
}

export const useOCRUpload = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const uploadStatusRef = useRef<UploadStatus>({});
  const processingTimeouts = useRef<{ [key: string]: NodeJS.Timeout }>({});

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

      setIsProcessing(true);

      if (file.type === "text/plain") {
        const text = await file.text();
        const result = { text, type: "text" };
        
        // Mark as done and cache result
        uploadStatusRef.current[fileKey] = {
          status: 'done',
          result,
          timestamp: Date.now()
        };
        
        onSuccess(result);
        toast({
          title: "Success",
          description: "Text file loaded successfully"
        });
        
      } else if (file.type === "application/pdf") {
        toast({
          title: "Processing PDF",
          description: "Extracting text from PDF file..."
        });

        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            const base64Data = e.target?.result as string;
            const base64Content = base64Data.split(',')[1];
            
            console.log(`[OCR] Processing file: ${file.name} (key: ${fileKey})`);
            
            // Add idempotency header using file key
            const { data, error } = await supabase.functions.invoke('parse-document', {
              body: { 
                fileData: base64Content,
                fileName: file.name,
                mimeType: file.type,
                idempotencyKey: fileKey // Add idempotency key
              }
            });
            
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
              return;
            }
            
            if (data?.text && data.text.trim()) {
              console.log(`[OCR] Successfully processed: ${file.name}`);
              
              // Mark as done and cache result
              uploadStatusRef.current[fileKey] = {
                status: 'done',
                result: data,
                timestamp: Date.now()
              };
              
              onSuccess(data);
              toast({
                title: "Success",
                description: "PDF text extracted successfully!"
              });
            } else {
              const errorMsg = "No readable text found in PDF. Please check if the file contains text or try a different format.";
              
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
            }
          } catch (parseError) {
            console.error('[OCR] Error in PDF processing:', parseError);
            
            // Mark as error
            uploadStatusRef.current[fileKey] = {
              status: 'error',
              timestamp: Date.now()
            };
            
            const errorMsg = parseError instanceof Error ? parseError.message : "Failed to extract text from PDF";
            toast({
              title: "Processing Error",
              description: errorMsg,
              variant: "destructive"
            });
            onError?.(errorMsg);
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
            description: "Failed to read PDF file",
            variant: "destructive"
          });
          onError?.("Failed to read PDF file");
        };
        
        reader.readAsDataURL(file);
        
      } else {
        const errorMsg = "Unsupported file type. Please upload PDF or text files.";
        
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
    } finally {
      setIsProcessing(false);
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
    getUploadStatus,
    clearFileStatus
  };
};