import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Mail, FileText, AlertTriangle, Printer, Upload, X, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportContractToPDF } from "@/utils/exportContractToPDF";

interface ContractData {
  date: string;
  producerName: string;
  investorName: string;
  filmTitle: string;
  investmentAmount: string;
  fundsUsedFor: string;
  recoupmentPercentage: string;
  creditTitle: string;
  creditPlacement: string;
  producerSignatory: string;
  companyLogo?: string;
}

interface EmailRecipient {
  email: string;
  note: string;
}

export default function ContractFiller() {
  const [contractData, setContractData] = useState<ContractData>({
    date: new Date().toISOString().split('T')[0],
    producerName: "",
    investorName: "",
    filmTitle: "",
    investmentAmount: "",
    fundsUsedFor: "Production",
    recoupmentPercentage: "120",
    creditTitle: "Executive Producer",
    creditPlacement: "End Credits",
    producerSignatory: "",
  });

  const [emailRecipients, setEmailRecipients] = useState<EmailRecipient[]>([
    { email: "", note: "" }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file must be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setCompanyLogo(base64);
      toast.success("Logo uploaded successfully!");
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setCompanyLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleInputChange = (field: keyof ContractData, value: string) => {
    setContractData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecipientChange = (index: number, field: keyof EmailRecipient, value: string) => {
    setEmailRecipients(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addRecipient = () => {
    setEmailRecipients(prev => [...prev, { email: "", note: "" }]);
  };

  const removeRecipient = (index: number) => {
    if (emailRecipients.length > 1) {
      setEmailRecipients(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDownloadPDF = () => {
    if (!contractData.filmTitle || !contractData.producerName || !contractData.investorName) {
      toast.error("Please fill in at least the Film Title, Producer Name, and Investor Name");
      return;
    }
    exportContractToPDF({ ...contractData, companyLogo: companyLogo || undefined });
    toast.success("Contract PDF downloaded successfully!");
  };

  const handlePrint = () => {
    if (!contractData.filmTitle || !contractData.producerName || !contractData.investorName) {
      toast.error("Please fill in at least the Film Title, Producer Name, and Investor Name");
      return;
    }
    exportContractToPDF({ ...contractData, companyLogo: companyLogo || undefined }, true);
  };

  const handleSendEmail = async () => {
    const validRecipients = emailRecipients.filter(r => r.email.trim() !== "");
    
    if (validRecipients.length === 0) {
      toast.error("Please add at least one email recipient");
      return;
    }

    if (!contractData.filmTitle || !contractData.producerName || !contractData.investorName) {
      toast.error("Please fill in at least the Film Title, Producer Name, and Investor Name");
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contract', {
        body: {
          recipients: validRecipients,
          contractData: { ...contractData, companyLogo: companyLogo || undefined },
        }
      });

      if (error) throw error;

      toast.success(`Contract sent to ${validRecipients.length} recipient(s)`);
      setEmailRecipients([{ email: "", note: "" }]);
    } catch (error: any) {
      console.error("Error sending contract:", error);
      toast.error(error.message || "Failed to send contract. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "[Date]";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "[Amount]";
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return amount;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link to="/pre-production" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pre-Production
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Investment Contract</h1>
            <Badge variant="secondary">Template</Badge>
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="mb-8 border-amber-500/50 bg-amber-500/10">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-600 mb-2">Important Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  This is a <strong>basic template</strong> for educational purposes only. It is <strong>NOT legal advice</strong> and should not be used as a substitute for consultation with a qualified entertainment attorney. 
                  Fill out all the information below, then download as PDF or send directly to recipients for review and signature.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Company Logo Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Company Logo
                </CardTitle>
                <CardDescription>Upload your company logo to appear at the top of the contract (Recommended: 200×60px, PNG or JPG)</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                
                {companyLogo ? (
                  <div className="flex items-center gap-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <img 
                        src={companyLogo} 
                        alt="Company Logo" 
                        className="max-w-[200px] max-h-[60px] object-contain"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={removeLogo}>
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full h-24 border-dashed"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6" />
                      <span>Click to upload logo</span>
                      <span className="text-xs text-muted-foreground">PNG or JPG, max 2MB</span>
                    </div>
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contract Details</CardTitle>
                <CardDescription>Fill in the fields to generate your contract</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Agreement Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={contractData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="filmTitle">Film Title *</Label>
                    <Input
                      id="filmTitle"
                      placeholder="Enter film title"
                      value={contractData.filmTitle}
                      onChange={(e) => handleInputChange("filmTitle", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="producerName">Production Company Name *</Label>
                  <Input
                    id="producerName"
                    placeholder="Enter your production company name"
                    value={contractData.producerName}
                    onChange={(e) => handleInputChange("producerName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="producerSignatory">Authorized Signatory</Label>
                  <Input
                    id="producerSignatory"
                    placeholder="Name of person signing for the company"
                    value={contractData.producerSignatory}
                    onChange={(e) => handleInputChange("producerSignatory", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investorName">Investor Name/Entity *</Label>
                  <Input
                    id="investorName"
                    placeholder="Enter investor's name or company"
                    value={contractData.investorName}
                    onChange={(e) => handleInputChange("investorName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount">Investment Amount ($)</Label>
                    <Input
                      id="investmentAmount"
                      placeholder="50000"
                      value={contractData.investmentAmount}
                      onChange={(e) => handleInputChange("investmentAmount", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fundsUsedFor">Funds Used For</Label>
                    <Select
                      value={contractData.fundsUsedFor}
                      onValueChange={(value) => handleInputChange("fundsUsedFor", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Production">Production</SelectItem>
                        <SelectItem value="Post-Production">Post-Production</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Production and Post-Production">Production & Post-Production</SelectItem>
                        <SelectItem value="All Phases">All Phases</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recoupmentPercentage">Recoupment Percentage (%)</Label>
                  <Input
                    id="recoupmentPercentage"
                    placeholder="120"
                    value={contractData.recoupmentPercentage}
                    onChange={(e) => handleInputChange("recoupmentPercentage", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Standard is 120% (investor gets their money back + 20% return)</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="creditTitle">Credit Title</Label>
                    <Select
                      value={contractData.creditTitle}
                      onValueChange={(value) => handleInputChange("creditTitle", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Executive Producer">Executive Producer</SelectItem>
                        <SelectItem value="Associate Producer">Associate Producer</SelectItem>
                        <SelectItem value="Co-Producer">Co-Producer</SelectItem>
                        <SelectItem value="Presented By">Presented By</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditPlacement">Credit Placement</Label>
                    <Select
                      value={contractData.creditPlacement}
                      onValueChange={(value) => handleInputChange("creditPlacement", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Main Titles">Main Titles</SelectItem>
                        <SelectItem value="End Credits">End Credits</SelectItem>
                        <SelectItem value="Main Titles and End Credits">Main & End Credits</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send Contract
                </CardTitle>
                <CardDescription>Send the contract directly to investors or legal team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailRecipients.map((recipient, index) => (
                  <div key={index} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-2">
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          placeholder="investor@example.com"
                          value={recipient.email}
                          onChange={(e) => handleRecipientChange(index, "email", e.target.value)}
                        />
                      </div>
                      {emailRecipients.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-6"
                          onClick={() => removeRecipient(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Note (optional)</Label>
                      <Textarea
                        placeholder="Add a personal note for this recipient..."
                        value={recipient.note}
                        onChange={(e) => handleRecipientChange(index, "note", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" onClick={addRecipient} className="w-full">
                  + Add Another Recipient
                </Button>

                <Button 
                  className="w-full" 
                  onClick={handleSendEmail}
                  disabled={isSending}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  {isSending ? "Sending..." : "Send Contract"}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleDownloadPDF} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handlePrint} className="flex-1">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          </div>

          {/* Preview Section */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Contract Preview</CardTitle>
                <CardDescription>Live preview of your contract</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black p-6 rounded-lg border shadow-inner text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-center mb-6">FILM INVESTMENT AGREEMENT</h2>
                  
                  <p className="mb-4">
                    This Agreement is entered into on this <strong>{formatDate(contractData.date)}</strong>, by and between:
                  </p>
                  
                  <p className="mb-4">
                    <strong>{contractData.producerName || "[Your Production Company Name]"}</strong> ("Producer") and<br />
                    <strong>{contractData.investorName || "[Investor Name/Entity]"}</strong> ("Investor").
                  </p>

                  <h3 className="font-bold mt-6 mb-2">1. The Project</h3>
                  <p className="mb-4">
                    The Investor agrees to provide capital for the production of the motion picture currently titled 
                    "<strong>{contractData.filmTitle || "[Film Title]"}</strong>" (the "Project").
                  </p>

                  <h3 className="font-bold mt-6 mb-2">2. Investment Amount</h3>
                  <p className="mb-4">
                    The Investor agrees to provide a total investment of <strong>{formatCurrency(contractData.investmentAmount)}</strong> (the "Investment"). 
                    These funds shall be used specifically for <strong>{contractData.fundsUsedFor}</strong> of the Project.
                  </p>

                  <h3 className="font-bold mt-6 mb-2">3. Recoupment (Getting Paid Back)</h3>
                  <p className="mb-2">The "Gross Receipts" (money earned from the film) shall be distributed in the following order of priority:</p>
                  <ol className="list-decimal pl-6 mb-4 space-y-1">
                    <li><strong>Expenses:</strong> Payment of sales agent fees, guild residuals, and distribution expenses.</li>
                    <li><strong>Investor Recoupment:</strong> 100% of remaining funds go to the Investor(s) until they have recovered <strong>{contractData.recoupmentPercentage || "120"}%</strong> of their initial Investment.</li>
                    <li><strong>Net Profits:</strong> Once the Investor has recouped {contractData.recoupmentPercentage || "120"}%, the remaining "Net Profits" are typically split 50/50 between the "Investor Pool" and the "Producer Pool."</li>
                  </ol>

                  <h3 className="font-bold mt-6 mb-2">4. Credit</h3>
                  <p className="mb-4">
                    Provided that the Investment is paid in full, the Investor shall receive the following on-screen credit:
                  </p>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Credit Title:</strong> {contractData.creditTitle}</li>
                    <li><strong>Placement:</strong> {contractData.creditPlacement}</li>
                  </ul>

                  <h3 className="font-bold mt-6 mb-2">5. Rights and Control</h3>
                  <ul className="list-disc pl-6 mb-4">
                    <li><strong>Creative Control:</strong> The Producer retains all creative control over the Project, including casting, editing, and distribution decisions.</li>
                    <li><strong>Ownership:</strong> The Investor acknowledges that this investment does not grant them ownership of the Intellectual Property (IP) or the copyright of the film.</li>
                  </ul>

                  <h3 className="font-bold mt-6 mb-2">6. Risk Disclosure</h3>
                  <p className="mb-4">
                    The Investor acknowledges that motion picture investments are highly speculative. There is no guarantee that the Project will be completed, distributed, or that any Investment will be recouped.
                  </p>

                  <h3 className="font-bold mt-6 mb-2">7. Signatures</h3>
                  <div className="mt-6 space-y-6">
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <p className="border-b border-black pb-2">Producer: _________________________</p>
                        <p className="text-xs text-gray-600 mt-1">(Authorized Signatory for {contractData.producerName || "[Company Name]"})</p>
                      </div>
                      <div className="w-32">
                        <p className="border-b border-black pb-2">Date: __________</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-4">
                      <div className="flex-1">
                        <p className="border-b border-black pb-2">Investor: _________________________</p>
                      </div>
                      <div className="w-32">
                        <p className="border-b border-black pb-2">Date: __________</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
