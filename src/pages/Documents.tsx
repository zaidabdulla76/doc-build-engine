import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Image, FileSpreadsheet, FileCheck, AlertCircle, Loader2, Eye, Trash2, Languages } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import { languages } from "@/data/languages";

const Documents = () => {
  const [documents, setDocuments] = useState<Array<{
    id: number;
    name: string;
    vendor: string;
    type: string;
    uploadDate: string;
    status: string;
    size: string;
    extractedData: any;
  }>>([
    {
      id: 1,
      name: "TechCorp_Financial_Statement_2024.pdf",
      vendor: "TechCorp Solutions",
      type: "Financial",
      uploadDate: "2024-10-11",
      status: "Analyzed",
      size: "2.4 MB",
      extractedData: { revenue: "$45M", risk: "Low" }
    },
    {
      id: 2,
      name: "DataFlow_Business_Registration.pdf",
      vendor: "DataFlow Systems",
      type: "Legal",
      uploadDate: "2024-10-10",
      status: "Processing",
      size: "1.2 MB",
      extractedData: null
    },
    {
      id: 3,
      name: "Global_Logistics_Compliance_Cert.pdf",
      vendor: "Global Logistics Ltd",
      type: "Compliance",
      uploadDate: "2024-10-09",
      status: "Analyzed",
      size: "856 KB",
      extractedData: { validUntil: "2025-12-31", risk: "Low" }
    },
    {
      id: 4,
      name: "SecureCloud_References.xlsx",
      vendor: "SecureCloud Inc",
      type: "References",
      uploadDate: "2024-10-08",
      status: "Pending Review",
      size: "124 KB",
      extractedData: null
    }
  ]);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const vendors = ["TechCorp Solutions", "DataFlow Systems", "Global Logistics Ltd", "SecureCloud Inc"];
  const docTypes = ["Financial", "Legal", "Compliance", "References", "Contract", "Other"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedVendor || !selectedDocType || !selectedLanguage) {
      toast({
        title: "Missing Information",
        description: "Please select a file, vendor, document type, and language",
        variant: "destructive"
      });
      return;
    }

    const selectedLang = languages.find(lang => lang.code === selectedLanguage);
    
    toast({
      title: "Language Selected",
      description: `Document will be analyzed in ${selectedLang?.name} (${selectedLang?.nativeName})`
    });

    setUploading(true);

    setTimeout(() => {
      const newDoc = {
        id: documents.length + 1,
        name: selectedFile.name,
        vendor: selectedVendor,
        type: selectedDocType,
        uploadDate: new Date().toISOString().split('T')[0],
        status: "Processing",
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
        extractedData: null
      };

      setDocuments([newDoc, ...documents]);
      setUploading(false);
      setIsUploadDialogOpen(false);
      setSelectedFile(null);
      setSelectedVendor("");
      setSelectedDocType("");
      setSelectedLanguage("en");

      toast({
        title: "Document Uploaded",
        description: `${selectedFile.name} is being analyzed by AI agents`
      });

      // Simulate analysis completion
      setTimeout(() => {
        setDocuments(prev => prev.map(doc => 
          doc.id === newDoc.id 
            ? { ...doc, status: "Analyzed", extractedData: { analyzed: true } }
            : doc
        ));
        
        toast({
          title: "Analysis Complete",
          description: `${selectedFile.name} has been analyzed`
        });
      }, 5000);
    }, 2000);
  };

  const handleView = (docName: string) => {
    toast({
      title: "Opening Document",
      description: `Loading ${docName}...`
    });
  };

  const handleDelete = (docId: number, docName: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast({
      title: "Document Deleted",
      description: `${docName} has been removed`
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Analyzed": return <FileCheck className="h-4 w-4 text-success" />;
      case "Processing": return <Loader2 className="h-4 w-4 text-accent animate-spin" />;
      case "Pending Review": return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Financial": return <FileSpreadsheet className="h-5 w-5 text-primary" />;
      case "Legal": return <FileText className="h-5 w-5 text-primary" />;
      case "Compliance": return <FileCheck className="h-5 w-5 text-primary" />;
      default: return <FileText className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Document Management</h1>
            <p className="text-muted-foreground mt-2">AI-powered document analysis and extraction</p>
          </div>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="vendor">Vendor *</Label>
                  <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor} value={vendor}>
                          {vendor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="docType">Document Type *</Label>
                  <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {docTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language" className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    Document Language *
                  </Label>
                  <LanguageSelector
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    placeholder="Select document language..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Select the language of your document for accurate AI analysis
                  </p>
                </div>

                <div>
                  <Label htmlFor="file">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleUpload} 
                  className="w-full"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload & Analyze"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Documents</span>
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{documents.length}</div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Analyzed</span>
              <FileCheck className="h-5 w-5 text-success" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {documents.filter(d => d.status === "Analyzed").length}
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Processing</span>
              <Loader2 className="h-5 w-5 text-accent animate-spin" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {documents.filter(d => d.status === "Processing").length}
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <AlertCircle className="h-5 w-5 text-warning" />
            </div>
            <div className="text-3xl font-bold text-foreground">
              {documents.filter(d => d.status === "Pending Review").length}
            </div>
          </Card>
        </div>

        <Card className="bg-card border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">All Documents</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Document</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Vendor</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Upload Date</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Size</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-border hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(doc.type)}
                        <span className="font-medium text-foreground">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-foreground">{doc.vendor}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline">{doc.type}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{doc.uploadDate}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-muted-foreground">{doc.size}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(doc.status)}
                        <span className="text-sm text-foreground">{doc.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleView(doc.name)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(doc.id, doc.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Documents;
