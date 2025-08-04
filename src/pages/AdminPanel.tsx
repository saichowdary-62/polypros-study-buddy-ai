import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Edit, Trash2, Upload, FileText, Settings, Shield, Bot, Calendar, Download, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Regulation {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface Semester {
  id: string;
  number: number;
  name: string;
}

interface Branch {
  id: string;
  code: string;
  name: string;
  description?: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  regulation_id: string;
  semester_id: string;
  branch_id: string;
  regulations?: { code: string; name: string };
  semesters?: { name: string };
  branches?: { code: string; name: string };
}

interface QuestionPaper {
  id: string;
  title: string;
  year?: number;
  month?: string;
  exam_type?: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  subject_id: string;
  created_at: string;
  subjects?: { code: string; name: string };
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [editingItem, setEditingItem] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("regulations");
  
  // Question paper form states
  const [paperDialogOpen, setPaperDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paperForm, setPaperForm] = useState({
    regulation_id: "",
    semester_id: "",
    branch_id: "",
    subject_id: "",
    title: "",
    year: "",
    month: "",
    exam_type: "",
    file: null as File | null
  });

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadRegulations(),
      loadSemesters(),
      loadBranches(),
      loadSubjects(),
      loadQuestionPapers(),
    ]);
    setLoading(false);
  };

  const loadRegulations = async () => {
    const { data, error } = await supabase.from('regulations').select('*').order('code');
    if (error) {
      toast({ title: "Error loading regulations", description: error.message, variant: "destructive" });
    } else {
      setRegulations(data || []);
    }
  };

  const loadSemesters = async () => {
    const { data, error } = await supabase.from('semesters').select('*').order('number');
    if (error) {
      toast({ title: "Error loading semesters", description: error.message, variant: "destructive" });
    } else {
      setSemesters(data || []);
    }
  };

  const loadBranches = async () => {
    const { data, error } = await supabase.from('branches').select('*').order('code');
    if (error) {
      toast({ title: "Error loading branches", description: error.message, variant: "destructive" });
    } else {
      setBranches(data || []);
    }
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        regulations!subjects_regulation_id_fkey(code, name),
        semesters!subjects_semester_id_fkey(name),
        branches!subjects_branch_id_fkey(code, name)
      `)
      .order('code');
    if (error) {
      console.error('Error loading subjects:', error);
      toast({ title: "Error loading subjects", description: error.message, variant: "destructive" });
    } else {
      setSubjects(data || []);
    }
  };

  const loadQuestionPapers = async () => {
    const { data, error } = await supabase
      .from('question_papers')
      .select(`
        *,
        subjects!question_papers_subject_id_fkey(code, name)
      `)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading question papers:', error);
      toast({ title: "Error loading question papers", description: error.message, variant: "destructive" });
    } else {
      setQuestionPapers(data || []);
    }
  };

  const handleSave = async (data: any, table: 'regulations' | 'semesters' | 'branches' | 'subjects' | 'question_papers') => {
    try {
      const { error } = editingItem?.id
        ? await supabase.from(table).update(data).eq('id', editingItem.id)
        : await supabase.from(table).insert([data]);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${editingItem?.id ? 'Updated' : 'Created'} successfully`,
      });

      setDialogOpen(false);
      setEditingItem(null);
      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, table: 'regulations' | 'semesters' | 'branches' | 'subjects' | 'question_papers') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from(table).delete().eq('id', id);

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Deleted successfully",
      });

      loadAllData();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async () => {
    if (!paperForm.file || !paperForm.subject_id || !paperForm.title) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!paperForm.file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = paperForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${paperForm.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = `papers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('question-papers')
        .upload(filePath, paperForm.file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload Error",
          description: uploadError.message,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('question-papers')
        .getPublicUrl(filePath);

      // Save question paper data
      const questionPaperData = {
        subject_id: paperForm.subject_id,
        title: paperForm.title,
        year: paperForm.year ? parseInt(paperForm.year) : null,
        month: paperForm.month || null,
        exam_type: paperForm.exam_type || null,
        file_url: publicUrl,
        file_name: paperForm.file.name,
        file_size: paperForm.file.size,
      };

      const { data, error } = await supabase
        .from('question_papers')
        .insert([questionPaperData])
        .select();

      if (error) {
        console.error('Database error:', error);
        toast({
          title: "Database Error",
          description: error.message,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Question paper uploaded successfully",
      });
      
      // Reset form
      setPaperForm({
        regulation_id: "",
        semester_id: "",
        branch_id: "",
        subject_id: "",
        title: "",
        year: "",
        month: "",
        exam_type: "",
        file: null
      });
      setPaperDialogOpen(false);
      
      // Reload data
      loadQuestionPapers();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "Failed to upload question paper",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      subject.regulation_id === paperForm.regulation_id &&
      subject.semester_id === paperForm.semester_id &&
      subject.branch_id === paperForm.branch_id
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = (paper: QuestionPaper) => {
    if (paper.file_url) {
      window.open(paper.file_url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-blue-100/50 animate-slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 animate-fade-in">
              <Bot className="h-8 w-8 text-blue-600 animate-bounce" />
              <span className="text-xl md:text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">PolyPros Admin</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Admin Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <Button 
                    onClick={() => {
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 justify-start"
                    variant="outline"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </Button>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Quick Navigation</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setActiveTab("regulations"); setMobileMenuOpen(false); }}
                        className="justify-start"
                      >
                        📋 Regulations
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setActiveTab("semesters"); setMobileMenuOpen(false); }}
                        className="justify-start"
                      >
                        📚 Semesters
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setActiveTab("branches"); setMobileMenuOpen(false); }}
                        className="justify-start"
                      >
                        🌿 Branches
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setActiveTab("subjects"); setMobileMenuOpen(false); }}
                        className="justify-start"
                      >
                        📖 Subjects
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => { setActiveTab("papers"); setMobileMenuOpen(false); }}
                        className="justify-start"
                      >
                        📄 Question Papers
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Admin Panel
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" />
              Manage question papers database
            </p>
          </div>

          {/* Main Content */}
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                <Settings className="h-6 w-6" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-blue-50 rounded-lg p-1 gap-1">
                  <TabsTrigger value="regulations" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs md:text-sm">Regulations</TabsTrigger>
                  <TabsTrigger value="semesters" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs md:text-sm">Semesters</TabsTrigger>
                  <TabsTrigger value="branches" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs md:text-sm">Branches</TabsTrigger>
                  <TabsTrigger value="subjects" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs md:text-sm">Subjects</TabsTrigger>
                  <TabsTrigger value="papers" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 text-xs md:text-sm col-span-2 md:col-span-1">Papers</TabsTrigger>
                </TabsList>

                {/* Regulations Tab */}
                <TabsContent value="regulations" className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">Regulations</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setDialogOpen(true);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Regulation
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900">
                            {editingItem?.id ? 'Edit' : 'Add'} Regulation
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reg-code">Code *</Label>
                            <Input
                              id="reg-code"
                              defaultValue={editingItem?.code || ''}
                              placeholder="e.g., C20"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="reg-name">Name *</Label>
                            <Input
                              id="reg-name"
                              defaultValue={editingItem?.name || ''}
                              placeholder="e.g., Curriculum 2020 Regulation"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="reg-description">Description</Label>
                            <Textarea
                              id="reg-description"
                              defaultValue={editingItem?.description || ''}
                              placeholder="Optional description"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const code = (document.getElementById('reg-code') as HTMLInputElement).value;
                              const name = (document.getElementById('reg-name') as HTMLInputElement).value;
                              const description = (document.getElementById('reg-description') as HTMLTextAreaElement).value;
                              
                              if (!code || !name) {
                                toast({ title: "Missing fields", description: "Code and Name are required", variant: "destructive" });
                                return;
                              }
                              
                              handleSave({ code, name, description }, 'regulations');
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {editingItem?.id ? 'Update' : 'Create'} Regulation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="font-semibold text-blue-900">Code</TableHead>
                          <TableHead className="font-semibold text-blue-900">Name</TableHead>
                          <TableHead className="font-semibold text-blue-900">Description</TableHead>
                          <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {regulations.map((regulation) => (
                          <TableRow key={regulation.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">{regulation.code}</TableCell>
                            <TableCell>{regulation.name}</TableCell>
                            <TableCell>{regulation.description || 'No description'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingItem(regulation);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(regulation.id, 'regulations')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Semesters Tab */}
                <TabsContent value="semesters" className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">Semesters</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setDialogOpen(true);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Semester
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900">
                            {editingItem?.id ? 'Edit' : 'Add'} Semester
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="sem-number">Number *</Label>
                            <Input
                              id="sem-number"
                              type="number"
                              defaultValue={editingItem?.number || ''}
                              placeholder="e.g., 1"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sem-name">Name *</Label>
                            <Input
                              id="sem-name"
                              defaultValue={editingItem?.name || ''}
                              placeholder="e.g., First Semester"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const number = (document.getElementById('sem-number') as HTMLInputElement).value;
                              const name = (document.getElementById('sem-name') as HTMLInputElement).value;
                              
                              if (!number || !name) {
                                toast({ title: "Missing fields", description: "Number and Name are required", variant: "destructive" });
                                return;
                              }
                              
                              handleSave({ number: parseInt(number), name }, 'semesters');
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {editingItem?.id ? 'Update' : 'Create'} Semester
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="font-semibold text-blue-900">Number</TableHead>
                          <TableHead className="font-semibold text-blue-900">Name</TableHead>
                          <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {semesters.map((semester) => (
                          <TableRow key={semester.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">{semester.number}</TableCell>
                            <TableCell>{semester.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingItem(semester);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(semester.id, 'semesters')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Branches Tab */}
                <TabsContent value="branches" className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">Branches</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setDialogOpen(true);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Branch
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900">
                            {editingItem?.id ? 'Edit' : 'Add'} Branch
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="branch-code">Code *</Label>
                            <Input
                              id="branch-code"
                              defaultValue={editingItem?.code || ''}
                              placeholder="e.g., CME"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="branch-name">Name *</Label>
                            <Input
                              id="branch-name"
                              defaultValue={editingItem?.name || ''}
                              placeholder="e.g., Computer Science and Engineering"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="branch-description">Description</Label>
                            <Textarea
                              id="branch-description"
                              defaultValue={editingItem?.description || ''}
                              placeholder="Optional description"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const code = (document.getElementById('branch-code') as HTMLInputElement).value;
                              const name = (document.getElementById('branch-name') as HTMLInputElement).value;
                              const description = (document.getElementById('branch-description') as HTMLTextAreaElement).value;
                              
                              if (!code || !name) {
                                toast({ title: "Missing fields", description: "Code and Name are required", variant: "destructive" });
                                return;
                              }
                              
                              handleSave({ code, name, description }, 'branches');
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {editingItem?.id ? 'Update' : 'Create'} Branch
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="font-semibold text-blue-900">Code</TableHead>
                          <TableHead className="font-semibold text-blue-900">Name</TableHead>
                          <TableHead className="font-semibold text-blue-900">Description</TableHead>
                          <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branches.map((branch) => (
                          <TableRow key={branch.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">{branch.code}</TableCell>
                            <TableCell>{branch.name}</TableCell>
                            <TableCell>{branch.description || 'No description'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingItem(branch);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(branch.id, 'branches')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Subjects Tab */}
                <TabsContent value="subjects" className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">Subjects</h3>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => {
                            setEditingItem(null);
                            setDialogOpen(true);
                          }}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="h-4 w-4" />
                          Add Subject
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900">
                            {editingItem?.id ? 'Edit' : 'Add'} Subject
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="subject-code">Code *</Label>
                            <Input
                              id="subject-code"
                              defaultValue={editingItem?.code || ''}
                              placeholder="e.g., 101"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subject-name">Name *</Label>
                            <Input
                              id="subject-name"
                              defaultValue={editingItem?.name || ''}
                              placeholder="e.g., Mathematics"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subject-regulation">Regulation *</Label>
                            <Select value={editingItem?.regulation_id || ''} onValueChange={(value) => setEditingItem({...editingItem, regulation_id: value})}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select regulation" />
                              </SelectTrigger>
                              <SelectContent>
                                {regulations.map((reg) => (
                                  <SelectItem key={reg.id} value={reg.id}>{reg.code} - {reg.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject-semester">Semester *</Label>
                            <Select value={editingItem?.semester_id || ''} onValueChange={(value) => setEditingItem({...editingItem, semester_id: value})}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                              <SelectContent>
                                {semesters.map((sem) => (
                                  <SelectItem key={sem.id} value={sem.id}>{sem.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject-branch">Branch *</Label>
                            <Select value={editingItem?.branch_id || ''} onValueChange={(value) => setEditingItem({...editingItem, branch_id: value})}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map((branch) => (
                                  <SelectItem key={branch.id} value={branch.id}>{branch.code} - {branch.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject-description">Description</Label>
                            <Textarea
                              id="subject-description"
                              defaultValue={editingItem?.description || ''}
                              placeholder="Optional description"
                              className="mt-1"
                            />
                          </div>
                          <Button
                            onClick={() => {
                              const code = (document.getElementById('subject-code') as HTMLInputElement).value;
                              const name = (document.getElementById('subject-name') as HTMLInputElement).value;
                              const description = (document.getElementById('subject-description') as HTMLTextAreaElement).value;
                              
                              if (!code || !name || !editingItem?.regulation_id || !editingItem?.semester_id || !editingItem?.branch_id) {
                                toast({ title: "Missing fields", description: "All fields are required", variant: "destructive" });
                                return;
                              }
                              
                              handleSave({ 
                                code, 
                                name, 
                                description, 
                                regulation_id: editingItem.regulation_id,
                                semester_id: editingItem.semester_id,
                                branch_id: editingItem.branch_id
                              }, 'subjects');
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            {editingItem?.id ? 'Update' : 'Create'} Subject
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50">
                          <TableHead className="font-semibold text-blue-900">Code</TableHead>
                          <TableHead className="font-semibold text-blue-900">Name</TableHead>
                          <TableHead className="font-semibold text-blue-900">Regulation</TableHead>
                          <TableHead className="font-semibold text-blue-900">Semester</TableHead>
                          <TableHead className="font-semibold text-blue-900">Branch</TableHead>
                          <TableHead className="font-semibold text-blue-900">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subjects.map((subject) => (
                          <TableRow key={subject.id} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell className="font-medium">{subject.code}</TableCell>
                            <TableCell>{subject.name}</TableCell>
                            <TableCell>{subject.regulations?.code}</TableCell>
                            <TableCell>{subject.semesters?.name}</TableCell>
                            <TableCell>{subject.branches?.code}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingItem(subject);
                                    setDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDelete(subject.id, 'subjects')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Question Papers Tab */}
                <TabsContent value="papers" className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-blue-900">Question Papers</h3>
                    <Dialog open={paperDialogOpen} onOpenChange={setPaperDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => setPaperDialogOpen(true)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Paper
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-blue-900 text-xl font-semibold">Upload Question Paper</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                          {/* Academic Selection Section */}
                          <div className="bg-blue-50/50 p-4 rounded-lg space-y-4">
                            <h4 className="font-medium text-blue-900 mb-3">Academic Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Regulation *</Label>
                                <Select value={paperForm.regulation_id} onValueChange={(value) => setPaperForm({...paperForm, regulation_id: value, semester_id: '', branch_id: '', subject_id: ''})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select regulation" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {regulations.map((reg) => (
                                      <SelectItem key={reg.id} value={reg.id}>{reg.code} - {reg.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Semester *</Label>
                                <Select 
                                  value={paperForm.semester_id} 
                                  onValueChange={(value) => setPaperForm({...paperForm, semester_id: value, branch_id: '', subject_id: ''})}
                                  disabled={!paperForm.regulation_id}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select semester" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {semesters.map((sem) => (
                                      <SelectItem key={sem.id} value={sem.id}>{sem.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Branch *</Label>
                                <Select 
                                  value={paperForm.branch_id} 
                                  onValueChange={(value) => setPaperForm({...paperForm, branch_id: value, subject_id: ''})}
                                  disabled={!paperForm.semester_id}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select branch" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {branches.map((branch) => (
                                      <SelectItem key={branch.id} value={branch.id}>{branch.code} - {branch.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Subject *</Label>
                                <Select 
                                  value={paperForm.subject_id} 
                                  onValueChange={(value) => setPaperForm({...paperForm, subject_id: value})}
                                  disabled={!paperForm.branch_id}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {getFilteredSubjects().map((subject) => (
                                      <SelectItem key={subject.id} value={subject.id}>{subject.code} - {subject.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Paper Details Section */}
                          <div className="bg-purple-50/50 p-4 rounded-lg space-y-4">
                            <h4 className="font-medium text-purple-900 mb-3">Paper Details</h4>
                            <div>
                              <Label htmlFor="title" className="text-sm font-medium">Paper Title *</Label>
                              <Input
                                id="title"
                                value={paperForm.title}
                                onChange={(e) => setPaperForm({...paperForm, title: e.target.value})}
                                placeholder="e.g., Mid-Term Exam 2024"
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                                <Input
                                  id="year"
                                  type="number"
                                  value={paperForm.year}
                                  onChange={(e) => setPaperForm({...paperForm, year: e.target.value})}
                                  placeholder="2024"
                                  className="mt-1"
                                  min="2020"
                                  max="2030"
                                />
                              </div>
                              <div>
                                <Label htmlFor="month" className="text-sm font-medium">Month</Label>
                                <Select value={paperForm.month} onValueChange={(value) => setPaperForm({...paperForm, month: value})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="January">January</SelectItem>
                                    <SelectItem value="February">February</SelectItem>
                                    <SelectItem value="March">March</SelectItem>
                                    <SelectItem value="April">April</SelectItem>
                                    <SelectItem value="May">May</SelectItem>
                                    <SelectItem value="June">June</SelectItem>
                                    <SelectItem value="July">July</SelectItem>
                                    <SelectItem value="August">August</SelectItem>
                                    <SelectItem value="September">September</SelectItem>
                                    <SelectItem value="October">October</SelectItem>
                                    <SelectItem value="November">November</SelectItem>
                                    <SelectItem value="December">December</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="exam_type" className="text-sm font-medium">Exam Type</Label>
                                <Select value={paperForm.exam_type} onValueChange={(value) => setPaperForm({...paperForm, exam_type: value})}>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                                    <SelectItem value="Final">Final</SelectItem>
                                    <SelectItem value="Internal">Internal</SelectItem>
                                    <SelectItem value="External">External</SelectItem>
                                    <SelectItem value="Regular">Regular</SelectItem>
                                    <SelectItem value="Supplementary">Supplementary</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* File Upload Section */}
                          <div className="bg-green-50/50 p-4 rounded-lg">
                            <h4 className="font-medium text-green-900 mb-3">File Upload</h4>
                            <div>
                              <Label htmlFor="file" className="text-sm font-medium">PDF File *</Label>
                              <Input
                                id="file"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => setPaperForm({...paperForm, file: e.target.files?.[0] || null})}
                                className="mt-1"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Only PDF files are accepted. Maximum file size: 10MB
                              </p>
                              {paperForm.file && (
                                <div className="mt-2 p-2 bg-white rounded border text-sm">
                                  <strong>Selected:</strong> {paperForm.file.name} ({(paperForm.file.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setPaperDialogOpen(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleFileUpload}
                              disabled={uploading || !paperForm.file || !paperForm.subject_id || !paperForm.title}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                            >
                              {uploading ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Uploading...
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Upload Paper
                                </div>
                              )}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-blue-50">
                            <TableHead className="font-semibold text-blue-900 min-w-[150px]">Title</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[120px]">Subject</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[80px]">Year</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[80px]">Month</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[100px]">Exam Type</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[80px]">File Size</TableHead>
                            <TableHead className="font-semibold text-blue-900 min-w-[120px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {questionPapers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                No question papers uploaded yet. Upload your first paper to get started!
                              </TableCell>
                            </TableRow>
                          ) : (
                            questionPapers.map((paper) => (
                              <TableRow key={paper.id} className="hover:bg-blue-50/50 transition-colors">
                                <TableCell className="font-medium">{paper.title}</TableCell>
                                <TableCell>{paper.subjects?.code || 'N/A'}</TableCell>
                                <TableCell>{paper.year || 'N/A'}</TableCell>
                                <TableCell>{paper.month || 'N/A'}</TableCell>
                                <TableCell>{paper.exam_type || 'N/A'}</TableCell>
                                <TableCell>{paper.file_size ? formatFileSize(paper.file_size) : 'N/A'}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDownload(paper)}
                                      title="Download PDF"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleDelete(paper.id, 'question_papers')}
                                      title="Delete Paper"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;