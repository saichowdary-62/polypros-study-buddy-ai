import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Upload, Download, FileText, Calendar, ArrowLeft, Save, X } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Edit, Trash2, Upload, Download, FileText, Settings, Database, BookOpen, GraduationCap, Building2, Bot, Menu, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const AdminPanel = () => {
  const navigate = useNavigate();
  
  // Password protection state
  
  // State for all data
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Dialog states
  const [showRegulationDialog, setShowRegulationDialog] = useState(false);
  const [showSemesterDialog, setShowSemesterDialog] = useState(false);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  
  // Edit states
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<QuestionPaper | null>(null);
  const [editingPaper, setEditingPaper] = useState<QuestionPaper | null>(null);
  
  // Form states
  const [regulationForm, setRegulationForm] = useState({ code: "", name: "", description: "" });
  const [semesterForm, setSemesterForm] = useState({ number: "", name: "" });
  const [branchForm, setBranchForm] = useState({ code: "", name: "", description: "" });
  const [subjectForm, setSubjectForm] = useState({ code: "", name: "", description: "", regulation_id: "", semester_id: "", branch_id: "" });
  const [paperForm, setPaperForm] = useState({ title: "", year: "", month: "", exam_type: "", subject_id: "" });
  
  // Upload form state
  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadRegulations(),
        loadSemesters(),
        loadBranches(),
        loadSubjects(),
        loadQuestionPapers()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const loadRegulations = async () => {
    const { data, error } = await supabase
      .from('regulations')
      .select('*')
      .order('code');
    
    if (error) {
      console.error("Error loading regulations:", error);
      toast.error("Failed to load regulations");
    } else {
      setRegulations(data || []);
    }
  };

  const loadSemesters = async () => {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('number');
    
    if (error) {
      console.error("Error loading semesters:", error);
      toast.error("Failed to load semesters");
    } else {
      setSemesters(data || []);
    }
  };

  const loadBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('code');
    
    if (error) {
      console.error("Error loading branches:", error);
      toast.error("Failed to load branches");
    } else {
      setBranches(data || []);
    }
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('code');
    
    if (error) {
      console.error("Error loading subjects:", error);
      toast.error("Failed to load subjects");
    } else {
      setSubjects(data || []);
    }
  };

  const loadQuestionPapers = async () => {
    const { data, error } = await supabase
      .from('question_papers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading question papers:", error);
      toast.error("Failed to load question papers");
    } else {
      setQuestionPapers(data || []);
    }
  };

  // CRUD operations for Regulations
  const handleRegulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRegulation) {
        const { error } = await supabase
          .from('regulations')
          .update(regulationForm)
          .eq('id', editingRegulation.id);
        
        if (error) throw error;
        toast.success("Regulation updated successfully");
      } else {
        const { error } = await supabase
          .from('regulations')
          .insert([regulationForm]);
        
        if (error) throw error;
        toast.success("Regulation added successfully");
      }
      
      setRegulationForm({ code: "", name: "", description: "" });
      setEditingRegulation(null);
      setShowRegulationDialog(false);
      loadRegulations();
    } catch (error) {
      console.error("Error saving regulation:", error);
      toast.error("Failed to save regulation");
    }
  };

  const handleDeleteRegulation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('regulations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Regulation deleted successfully");
      loadRegulations();
    } catch (error) {
      console.error("Error deleting regulation:", error);
      toast.error("Failed to delete regulation");
    }
  };

  // CRUD operations for Semesters
  const handleSemesterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const semesterData = {
        ...semesterForm,
        number: parseInt(semesterForm.number)
      };
      
      if (editingSemester) {
        const { error } = await supabase
          .from('semesters')
          .update(semesterData)
          .eq('id', editingSemester.id);
        
        if (error) throw error;
        toast.success("Semester updated successfully");
      } else {
        const { error } = await supabase
          .from('semesters')
          .insert([semesterData]);
        
        if (error) throw error;
        toast.success("Semester added successfully");
      }
      
      setSemesterForm({ number: "", name: "" });
      setEditingSemester(null);
      setShowSemesterDialog(false);
      loadSemesters();
    } catch (error) {
      console.error("Error saving semester:", error);
      toast.error("Failed to save semester");
    }
  };

  const handleDeleteSemester = async (id: string) => {
    try {
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Semester deleted successfully");
      loadSemesters();
    } catch (error) {
      console.error("Error deleting semester:", error);
      toast.error("Failed to delete semester");
    }
  };

  // CRUD operations for Branches
  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingBranch) {
        const { error } = await supabase
          .from('branches')
          .update(branchForm)
          .eq('id', editingBranch.id);
        
        if (error) throw error;
        toast.success("Branch updated successfully");
      } else {
        const { error } = await supabase
          .from('branches')
          .insert([branchForm]);
        
        if (error) throw error;
        toast.success("Branch added successfully");
      }
      
      setBranchForm({ code: "", name: "", description: "" });
      setEditingBranch(null);
      setShowBranchDialog(false);
      loadBranches();
    } catch (error) {
      console.error("Error saving branch:", error);
      toast.error("Failed to save branch");
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Branch deleted successfully");
      loadBranches();
    } catch (error) {
      console.error("Error deleting branch:", error);
      toast.error("Failed to delete branch");
    }
  };

  // CRUD operations for Subjects
  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update(subjectForm)
          .eq('id', editingSubject.id);
        
        if (error) throw error;
        toast.success("Subject updated successfully");
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert([subjectForm]);
        
        if (error) throw error;
        toast.success("Subject added successfully");
      }
      
      setSubjectForm({ code: "", name: "", description: "", regulation_id: "", semester_id: "", branch_id: "" });
      setEditingSubject(null);
      setShowSubjectDialog(false);
      loadSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error("Failed to save subject");
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success("Subject deleted successfully");
      loadSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    }
  };

  // Question Paper Upload
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    setUploading(true);
    
    try {
      console.log("Starting upload process...");
      
      // Upload file to Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      console.log("Uploading file to storage:", filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('question-papers')
        .upload(filePath, uploadForm.file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }
      
      console.log("File uploaded successfully:", uploadData);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('question-papers')
        .getPublicUrl(filePath);
      
      console.log("Public URL generated:", urlData.publicUrl);
      
      // Save metadata to database
      const paperData = {
        subject_id: uploadForm.subject_id,
        title: uploadForm.title,
        year: uploadForm.year ? parseInt(uploadForm.year) : null,
        month: uploadForm.month || null,
        exam_type: uploadForm.exam_type || null,
        file_url: urlData.publicUrl,
        file_name: uploadForm.file.name,
        file_size: uploadForm.file.size
      };
      
      console.log("Saving paper metadata:", paperData);
      
      const { data: insertData, error: insertError } = await supabase
        .from('question_papers')
        .insert([paperData])
        .select();
      
      if (insertError) {
        console.error("Database insert error:", insertError);
        throw insertError;
      }
      
      console.log("Paper metadata saved successfully:", insertData);
      
      toast.success("Question paper uploaded successfully");
      setUploadForm({
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
      setShowUploadDialog(false);
      loadQuestionPapers();
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  // Paper Update
  const handlePaperUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPaper || !editingPaper) return;
    
    try {
      const { error } = await supabase
        .from('question_papers')
        .update({
          title: editingPaper.title,
          year: editingPaper.year,
          month: editingPaper.month,
          exam_type: editingPaper.exam_type
        })
        .eq('id', selectedPaper.id);
      
      if (error) throw error;
      
      toast.success("Question paper updated successfully");
      setSelectedPaper(null);
      setEditingPaper(null);
      loadQuestionPapers();
    } catch (error) {
      console.error("Error updating paper:", error);
      toast.error("Failed to update question paper");
    }
  };

  const handleDeleteQuestionPaper = async (paper: QuestionPaper) => {
    try {
      // Delete from storage if file exists
      if (paper.file_url) {
        const fileName = paper.file_url.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('question-papers')
            .remove([fileName]);
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', paper.id);
      
      if (error) throw error;
      
      toast.success("Question paper deleted successfully");
      loadQuestionPapers();
    } catch (error) {
      console.error("Error deleting question paper:", error);
      toast.error("Failed to delete question paper");
    }
  };

  // Helper functions
  const getRegulationName = (id: string) => {
    const regulation = regulations.find(r => r.id === id);
    return regulation ? `${regulation.code} - ${regulation.name}` : 'Unknown';
  };

  const getSemesterName = (id: string) => {
    const semester = semesters.find(s => s.id === id);
    return semester ? semester.name : 'Unknown';
  };

  const getBranchName = (id: string) => {
    const branch = branches.find(b => b.id === id);
    return branch ? `${branch.code} - ${branch.name}` : 'Unknown';
  };

  const getSubjectName = (id: string) => {
    const subject = subjects.find(s => s.id === id);
    return subject ? `${subject.code} - ${subject.name}` : 'Unknown';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter subjects based on selected regulation, semester, and branch
  const getFilteredSubjects = () => {
    return subjects.filter(subject => 
      subject.regulation_id === uploadForm.regulation_id &&
              {/* Subjects Tab */}
              <TabsContent value="subjects">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Subjects</h3>
                    <Button onClick={() => setShowAddSubject(true)}>
                      Add Subject
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{subject.code} - {subject.name}</h4>
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
            <div className="flex items-center space-x-4 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Bot className="h-8 w-8 text-blue-600 animate-bounce" />
              <span className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">PolyPros Admin</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAuthenticated(false)}
                className="text-red-600 hover:text-red-700"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Admin Panel
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Manage regulations, semesters, branches, subjects, and question papers
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="regulations" className="w-full animate-fade-in-delayed">
            {/* Mobile menu */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden mb-4`}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <TabsTrigger value="regulations" className="w-full justify-start flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Regulations
                    </TabsTrigger>
                    <TabsTrigger value="semesters" className="w-full justify-start flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Semesters
                    </TabsTrigger>
                    <TabsTrigger value="branches" className="w-full justify-start flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Branches
                    </TabsTrigger>
                    <TabsTrigger value="subjects" className="w-full justify-start flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Subjects
                    </TabsTrigger>
                    <TabsTrigger value="papers" className="w-full justify-start flex items-center gap-2">
                      <FileText className="h-4 w-4" />
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
            </CardHeader>
            <CardContent>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full h-auto">
                <TabsTrigger 
                  value="regulations" 
                  className="w-full"
                >
                  Regulations
                </TabsTrigger>
                <TabsTrigger 
                  value="semesters" 
                  className="w-full"
                >
                  Semesters
                </TabsTrigger>
                <TabsTrigger 
                  value="branches" 
                  className="w-full"
                >
                  Branches
                </TabsTrigger>
                <TabsTrigger 
                  value="subjects" 
                  className="w-full"
                >
                  Subjects
                </TabsTrigger>
              </TabsList>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Regulations Management
                  </CardTitle>
                  <Dialog open={showRegulationDialog} onOpenChange={setShowRegulationDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Regulation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingRegulation ? 'Edit Regulation' : 'Add New Regulation'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleRegulationSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="code">Code</Label>
                          <Input
                            id="code"
                            value={regulationForm.code}
                            onChange={(e) => setRegulationForm({...regulationForm, code: e.target.value})}
                            placeholder="e.g., C20, C23"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={regulationForm.name}
                            onChange={(e) => setRegulationForm({...regulationForm, name: e.target.value})}
                            placeholder="e.g., Curriculum 2020"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={regulationForm.description}
                            onChange={(e) => setRegulationForm({...regulationForm, description: e.target.value})}
                            placeholder="Optional description"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setShowRegulationDialog(false);
                            setEditingRegulation(null);
                            setRegulationForm({ code: "", name: "", description: "" });
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingRegulation ? 'Update' : 'Add'} Regulation
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {regulations.map((regulation) => (
                      <div key={regulation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{regulation.code} - {regulation.name}</h3>
                          {regulation.description && (
                            <p className="text-sm text-gray-600">{regulation.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
              {/* Regulations Tab */}
              <TabsContent value="regulations">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Regulations</h3>
                    <Button onClick={() => setShowAddRegulation(true)}>
                      Add Regulation
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {regulations.map((regulation) => (
                      <div key={regulation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{regulation.code} - {regulation.name}</h4>
                          {regulation.description && (
                            <p className="text-sm text-muted-foreground">{regulation.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingRegulation(regulation);
                              setShowAddRegulation(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteRegulation(regulation.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

            <TabsContent value="semesters" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Semesters Management
                  </CardTitle>
                  <Dialog open={showSemesterDialog} onOpenChange={setShowSemesterDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Semester
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingSemester ? 'Edit Semester' : 'Add New Semester'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSemesterSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="number">Number</Label>
                          <Input
                            id="number"
                            type="number"
                            value={semesterForm.number}
                            onChange={(e) => setSemesterForm({...semesterForm, number: e.target.value})}
                            placeholder="e.g., 1, 2, 3"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={semesterForm.name}
                            onChange={(e) => setSemesterForm({...semesterForm, name: e.target.value})}
                            placeholder="e.g., 1st & 2nd Semester"
                            required
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setShowSemesterDialog(false);
                            setEditingSemester(null);
                            setSemesterForm({ number: "", name: "" });
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingSemester ? 'Update' : 'Add'} Semester
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {semesters.map((semester) => (
                      <div key={semester.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-semibold">Semester {semester.number}: {semester.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
              {/* Semesters Tab */}
              <TabsContent value="semesters">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Semesters</h3>
                    <Button onClick={() => setShowAddSemester(true)}>
                      Add Semester
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {semesters.map((semester) => (
                      <div key={semester.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{semester.name}</h4>
                          <p className="text-sm text-muted-foreground">Semester {semester.number}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingSemester(semester);
                              setShowAddSemester(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteSemester(semester.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

            <TabsContent value="branches" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Branches Management
                  </CardTitle>
                  <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleBranchSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="code">Code</Label>
                          <Input
                            id="code"
                            value={branchForm.code}
                            onChange={(e) => setBranchForm({...branchForm, code: e.target.value})}
                            placeholder="e.g., CME, ECE"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={branchForm.name}
                            onChange={(e) => setBranchForm({...branchForm, name: e.target.value})}
                            placeholder="e.g., Computer Engineering"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={branchForm.description}
                            onChange={(e) => setBranchForm({...branchForm, description: e.target.value})}
                            placeholder="Optional description"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setShowBranchDialog(false);
                            setEditingBranch(null);
                            setBranchForm({ code: "", name: "", description: "" });
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingBranch ? 'Update' : 'Add'} Branch
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {branches.map((branch) => (
                      <div key={branch.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{branch.code} - {branch.name}</h3>
                          {branch.description && (
                            <p className="text-sm text-gray-600">{branch.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
              {/* Branches Tab */}
              <TabsContent value="branches">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Branches</h3>
                    <Button onClick={() => setShowAddBranch(true)}>
                      Add Branch
                    </Button>
                  </div>
                  
                  <div className="grid gap-4">
                    {branches.map((branch) => (
                      <div key={branch.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{branch.code} - {branch.name}</h4>
                          {branch.description && (
                            <p className="text-sm text-muted-foreground">{branch.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingBranch(branch);
                              setShowAddBranch(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

            <TabsContent value="subjects" className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Subjects Management
                  </CardTitle>
                  <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubjectSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="regulation">Regulation</Label>
                            <Select
                              value={subjectForm.regulation_id}
                              onValueChange={(value) => setSubjectForm({...subjectForm, regulation_id: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select regulation" />
                              </SelectTrigger>
                              <SelectContent>
                                {regulations.map((regulation) => (
                                  <SelectItem key={regulation.id} value={regulation.id}>
                                    {regulation.code} - {regulation.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="semester">Semester</Label>
                            <Select
                              value={subjectForm.semester_id}
                              onValueChange={(value) => setSubjectForm({...subjectForm, semester_id: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                              <SelectContent>
                                {semesters.map((semester) => (
                                  <SelectItem key={semester.id} value={semester.id}>
                                    {semester.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="branch">Branch</Label>
                          <Select
                            value={subjectForm.branch_id}
                            onValueChange={(value) => setSubjectForm({...subjectForm, branch_id: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.code} - {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="code">Subject Code</Label>
                            <Input
                              id="code"
                              value={subjectForm.code}
                              onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                              placeholder="e.g., CM-101"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="name">Subject Name</Label>
                            <Input
                              id="name"
                              value={subjectForm.name}
                              onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                              placeholder="e.g., Programming in C"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={subjectForm.description}
                            onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                            placeholder="Optional description"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setShowSubjectDialog(false);
                            setEditingSubject(null);
                            setSubjectForm({ code: "", name: "", description: "", regulation_id: "", semester_id: "", branch_id: "" });
                          }}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingSubject ? 'Update' : 'Add'} Subject
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div>
                          <h3 className="font-semibold">{subject.code} - {subject.name}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Regulation: {getRegulationName(subject.regulation_id)}</p>
                            <p>Semester: {getSemesterName(subject.semester_id)}</p>
                            <p>Branch: {getBranchName(subject.branch_id)}</p>
                            {subject.description && <p>Description: {subject.description}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSubject(subject);
                              setSubjectForm({
                                code: subject.code,
                                name: subject.name,
                                description: subject.description || "",
                                regulation_id: subject.regulation_id,
                                semester_id: subject.semester_id,
                                branch_id: subject.branch_id
                              });
                              setShowSubjectDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this subject? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSubject(subject.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Question Papers Tab */}
            <TabsContent value="papers" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Question Papers List */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Question Papers
                    </CardTitle>
                    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Upload Question Paper</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="regulation">Regulation *</Label>
                              <Select
                                value={uploadForm.regulation_id}
                                onValueChange={(value) => setUploadForm({
                                  ...uploadForm, 
                                  regulation_id: value,
                                  semester_id: "",
                                  branch_id: "",
                                  subject_id: ""
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select regulation" />
                                </SelectTrigger>
                                <SelectContent>
                                  {regulations.map((regulation) => (
                                    <SelectItem key={regulation.id} value={regulation.id}>
                                      {regulation.code} - {regulation.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="semester">Semester *</Label>
                              <Select
                                value={uploadForm.semester_id}
                                onValueChange={(value) => setUploadForm({
                                  ...uploadForm, 
                                  semester_id: value,
                                  branch_id: "",
                                  subject_id: ""
                                })}
                                disabled={!uploadForm.regulation_id}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent>
                                  {semesters.map((semester) => (
                                    <SelectItem key={semester.id} value={semester.id}>
                                      {semester.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="branch">Branch *</Label>
                            <Select
                              value={uploadForm.branch_id}
                              onValueChange={(value) => setUploadForm({
                                ...uploadForm, 
                                branch_id: value,
                                subject_id: ""
                              })}
                              disabled={!uploadForm.semester_id}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                              <SelectContent>
                                {branches.map((branch) => (
                                  <SelectItem key={branch.id} value={branch.id}>
                                    {branch.code} - {branch.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Select
                              value={uploadForm.subject_id}
                              onValueChange={(value) => setUploadForm({...uploadForm, subject_id: value})}
                              disabled={!uploadForm.branch_id}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                              <SelectContent>
                                {getFilteredSubjects().map((subject) => (
                                  <SelectItem key={subject.id} value={subject.id}>
                                    {subject.code} - {subject.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="title">Paper Title *</Label>
                            <Input
                              id="title"
                              value={uploadForm.title}
                              onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                              placeholder="e.g., Mid-term Examination - May 2023"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="year">Year</Label>
                              <Input
                                id="year"
                                type="number"
                                value={uploadForm.year}
                                onChange={(e) => setUploadForm({...uploadForm, year: e.target.value})}
                                placeholder="2023"
                              />
                            </div>
                            <div>
                              <Label htmlFor="month">Month</Label>
                              <Input
                                id="month"
                                value={uploadForm.month}
                                onChange={(e) => setUploadForm({...uploadForm, month: e.target.value})}
                                placeholder="May"
                              />
                            </div>
                            <div>
                              <Label htmlFor="exam_type">Exam Type</Label>
                              <Select
                                value={uploadForm.exam_type}
                                onValueChange={(value) => setUploadForm({...uploadForm, exam_type: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Mid-term">Mid-term</SelectItem>
                                  <SelectItem value="End-term">End-term</SelectItem>
                                  <SelectItem value="Supplementary">Supplementary</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="file">Question Paper File *</Label>
                            <Input
                              id="file"
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => setUploadForm({...uploadForm, file: e.target.files?.[0] || null})}
                              disabled={!uploadForm.subject_id}
                              required
                            />
                            <p className="text-sm text-gray-500 mt-1">
                              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                            </p>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => {
                              setShowUploadDialog(false);
                              setUploadForm({
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
                            }}>
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={uploading || !uploadForm.subject_id || !uploadForm.file}
                            >
                              {uploading ? 'Uploading...' : 'Upload Paper'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[70vh] overflow-y-auto space-y-3">
                      {questionPapers.map((paper) => (
                        <div 
                          key={paper.id} 
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => setSelectedPaper(paper)}
                        >
                          <h3 className="font-semibold text-sm">{paper.title}</h3>
                          <p className="text-xs text-gray-600">{getSubjectName(paper.subject_id)}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">
                              {paper.year && paper.month && `${paper.month} ${paper.year}`}
                            </span>
                            <div className="flex gap-1">
                              {paper.file_url && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(paper.file_url, '_blank');
                                  }}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Question Paper</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this question paper? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteQuestionPaper(paper)}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Paper Edit/Details Panel */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5 text-purple-600" />
                      {selectedPaper ? 'Edit Question Paper' : 'Select a Paper to Edit'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPaper ? (
                      <form onSubmit={(e) => handlePaperUpdate(e)} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-title">Paper Title</Label>
                          <Input
                            id="edit-title"
                            value={editingPaper?.title || selectedPaper.title}
                            onChange={(e) => setEditingPaper({
                              ...selectedPaper,
                              title: e.target.value
                            })}
                            placeholder="Enter paper title"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="edit-year">Year</Label>
                            <Input
                              id="edit-year"
                              type="number"
                              value={editingPaper?.year?.toString() || selectedPaper.year?.toString() || ""}
                              onChange={(e) => setEditingPaper({
                                ...selectedPaper,
                                year: parseInt(e.target.value) || undefined
                              })}
                              placeholder="2023"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-month">Month</Label>
                            <Input
                              id="edit-month"
                              value={editingPaper?.month || selectedPaper.month || ""}
                              onChange={(e) => setEditingPaper({
                                ...selectedPaper,
                                month: e.target.value
                              })}
                              placeholder="May"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="edit-exam-type">Exam Type</Label>
                          <Select
                            value={editingPaper?.exam_type || selectedPaper.exam_type || ""}
                            onValueChange={(value) => setEditingPaper({
                              ...selectedPaper,
                              exam_type: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select exam type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mid-term">Mid-term</SelectItem>
                              <SelectItem value="End-term">End-term</SelectItem>
                              <SelectItem value="Supplementary">Supplementary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Current Details</Label>
                          <div className="text-sm text-gray-600 space-y-1 p-3 bg-gray-50 rounded">
                            <p><strong>Subject:</strong> {getSubjectName(selectedPaper.subject_id)}</p>
                            <p><strong>File:</strong> {selectedPaper.file_name}</p>
                            {selectedPaper.file_size && (
                              <p><strong>Size:</strong> {formatFileSize(selectedPaper.file_size)}</p>
                            )}
                            <p><strong>Uploaded:</strong> {new Date(selectedPaper.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            Update Paper
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setSelectedPaper(null);
                              setEditingPaper(null);
                            }}
                          >
                            Cancel
                          </Button>
                          {selectedPaper.file_url && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => window.open(selectedPaper.file_url, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </div>
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Select a question paper from the list to view and edit details</p>
                      </div>
                     )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;