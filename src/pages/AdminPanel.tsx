import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Download, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  Building, 
  Calendar,
  ArrowLeft,
  Lock,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from "lucide-react";
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
  subjects?: {
    code: string;
    name: string;
    regulations?: { code: string };
    semesters?: { name: string };
    branches?: { code: string };
  };
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Data states
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);

  // Form states
  const [activeTab, setActiveTab] = useState("regulations");
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);

  // Form data states
  const [regulationForm, setRegulationForm] = useState({ code: "", name: "", description: "" });
  const [semesterForm, setSemesterForm] = useState({ number: "", name: "" });
  const [branchForm, setBranchForm] = useState({ code: "", name: "", description: "" });
  const [subjectForm, setSubjectForm] = useState({ 
    code: "", 
    name: "", 
    description: "", 
    regulation_id: "", 
    semester_id: "", 
    branch_id: "" 
  });
  const [paperForm, setPaperForm] = useState({
    title: "",
    year: "",
    month: "",
    exam_type: "",
    subject_id: "",
    file: null as File | null
  });

  // Check authentication on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "srmt") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      setAuthError("");
      loadAllData();
    } else {
      setAuthError("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    setPassword("");
  };

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
      toast({ title: "Error loading data", variant: "destructive" });
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
      toast({ title: "Error loading regulations", variant: "destructive" });
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
      toast({ title: "Error loading semesters", variant: "destructive" });
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
      toast({ title: "Error loading branches", variant: "destructive" });
    } else {
      setBranches(data || []);
    }
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        regulations(code, name),
        semesters(name),
        branches(code, name)
      `)
      .order('code');
    
    if (error) {
      console.error("Error loading subjects:", error);
      toast({ title: "Error loading subjects", variant: "destructive" });
    } else {
      setSubjects(data || []);
    }
  };

  const loadQuestionPapers = async () => {
    const { data, error } = await supabase
      .from('question_papers')
      .select(`
        *,
        subjects(
          code,
          name,
          regulations(code),
          semesters(name),
          branches(code)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error loading question papers:", error);
      toast({ title: "Error loading question papers", variant: "destructive" });
    } else {
      setQuestionPapers(data || []);
    }
  };

  // CRUD Operations for Regulations
  const handleRegulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('regulations')
          .update(regulationForm)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Regulation updated successfully" });
      } else {
        const { error } = await supabase
          .from('regulations')
          .insert([regulationForm]);
        
        if (error) throw error;
        toast({ title: "Regulation created successfully" });
      }
      
      setRegulationForm({ code: "", name: "", description: "" });
      setEditingItem(null);
      setShowDialog(false);
      loadRegulations();
    } catch (error: any) {
      console.error("Error saving regulation:", error);
      toast({ 
        title: "Error saving regulation", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRegulation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this regulation?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('regulations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Regulation deleted successfully" });
      loadRegulations();
    } catch (error: any) {
      console.error("Error deleting regulation:", error);
      toast({ 
        title: "Error deleting regulation", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Semesters
  const handleSemesterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const semesterData = {
        number: parseInt(semesterForm.number),
        name: semesterForm.name
      };

      if (editingItem) {
        const { error } = await supabase
          .from('semesters')
          .update(semesterData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Semester updated successfully" });
      } else {
        const { error } = await supabase
          .from('semesters')
          .insert([semesterData]);
        
        if (error) throw error;
        toast({ title: "Semester created successfully" });
      }
      
      setSemesterForm({ number: "", name: "" });
      setEditingItem(null);
      setShowDialog(false);
      loadSemesters();
    } catch (error: any) {
      console.error("Error saving semester:", error);
      toast({ 
        title: "Error saving semester", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSemester = async (id: string) => {
    if (!confirm("Are you sure you want to delete this semester?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Semester deleted successfully" });
      loadSemesters();
    } catch (error: any) {
      console.error("Error deleting semester:", error);
      toast({ 
        title: "Error deleting semester", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Branches
  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('branches')
          .update(branchForm)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Branch updated successfully" });
      } else {
        const { error } = await supabase
          .from('branches')
          .insert([branchForm]);
        
        if (error) throw error;
        toast({ title: "Branch created successfully" });
      }
      
      setBranchForm({ code: "", name: "", description: "" });
      setEditingItem(null);
      setShowDialog(false);
      loadBranches();
    } catch (error: any) {
      console.error("Error saving branch:", error);
      toast({ 
        title: "Error saving branch", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBranch = async (id: string) => {
    if (!confirm("Are you sure you want to delete this branch?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Branch deleted successfully" });
      loadBranches();
    } catch (error: any) {
      console.error("Error deleting branch:", error);
      toast({ 
        title: "Error deleting branch", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Subjects
  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('subjects')
          .update(subjectForm)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Subject updated successfully" });
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert([subjectForm]);
        
        if (error) throw error;
        toast({ title: "Subject created successfully" });
      }
      
      setSubjectForm({ 
        code: "", 
        name: "", 
        description: "", 
        regulation_id: "", 
        semester_id: "", 
        branch_id: "" 
      });
      setEditingItem(null);
      setShowDialog(false);
      loadSubjects();
    } catch (error: any) {
      console.error("Error saving subject:", error);
      toast({ 
        title: "Error saving subject", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Subject deleted successfully" });
      loadSubjects();
    } catch (error: any) {
      console.error("Error deleting subject:", error);
      toast({ 
        title: "Error deleting subject", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations for Question Papers
  const handlePaperSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = "";
      let fileName = "";
      let fileSize = 0;

      // Upload file if provided
      if (paperForm.file) {
        const fileExt = paperForm.file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-papers')
          .upload(filePath, paperForm.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('question-papers')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileName = paperForm.file.name;
        fileSize = paperForm.file.size;
      }

      const paperData = {
        title: paperForm.title,
        year: paperForm.year ? parseInt(paperForm.year) : null,
        month: paperForm.month || null,
        exam_type: paperForm.exam_type || null,
        subject_id: paperForm.subject_id,
        file_url: fileUrl || null,
        file_name: fileName || null,
        file_size: fileSize || null
      };

      if (editingItem) {
        // If editing and no new file, keep existing file data
        if (!paperForm.file) {
          delete paperData.file_url;
          delete paperData.file_name;
          delete paperData.file_size;
        }

        const { error } = await supabase
          .from('question_papers')
          .update(paperData)
          .eq('id', editingItem.id);
        
        if (error) throw error;
        toast({ title: "Question paper updated successfully" });
      } else {
        const { error } = await supabase
          .from('question_papers')
          .insert([paperData]);
        
        if (error) throw error;
        toast({ title: "Question paper created successfully" });
      }
      
      setPaperForm({
        title: "",
        year: "",
        month: "",
        exam_type: "",
        subject_id: "",
        file: null
      });
      setEditingItem(null);
      setShowDialog(false);
      loadQuestionPapers();
    } catch (error: any) {
      console.error("Error saving question paper:", error);
      toast({ 
        title: "Error saving question paper", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaper = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question paper?")) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Question paper deleted successfully" });
      loadQuestionPapers();
    } catch (error: any) {
      console.error("Error deleting question paper:", error);
      toast({ 
        title: "Error deleting question paper", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const handleEditRegulation = (regulation: Regulation) => {
    setRegulationForm({
      code: regulation.code,
      name: regulation.name,
      description: regulation.description || ""
    });
    setEditingItem(regulation);
    setShowDialog(true);
  };

  const handleEditSemester = (semester: Semester) => {
    setSemesterForm({
      number: semester.number.toString(),
      name: semester.name
    });
    setEditingItem(semester);
    setShowDialog(true);
  };

  const handleEditBranch = (branch: Branch) => {
    setBranchForm({
      code: branch.code,
      name: branch.name,
      description: branch.description || ""
    });
    setEditingItem(branch);
    setShowDialog(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectForm({
      code: subject.code,
      name: subject.name,
      description: subject.description || "",
      regulation_id: subject.regulation_id,
      semester_id: subject.semester_id,
      branch_id: subject.branch_id
    });
    setEditingItem(subject);
    setShowDialog(true);
  };

  const handleEditPaper = (paper: QuestionPaper) => {
    setPaperForm({
      title: paper.title,
      year: paper.year?.toString() || "",
      month: paper.month || "",
      exam_type: paper.exam_type || "",
      subject_id: paper.subject_id,
      file: null
    });
    setEditingItem(paper);
    setShowDialog(true);
  };

  // Utility functions
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetForms = () => {
    setRegulationForm({ code: "", name: "", description: "" });
    setSemesterForm({ number: "", name: "" });
    setBranchForm({ code: "", name: "", description: "" });
    setSubjectForm({ 
      code: "", 
      name: "", 
      description: "", 
      regulation_id: "", 
      semester_id: "", 
      branch_id: "" 
    });
    setPaperForm({
      title: "",
      year: "",
      month: "",
      exam_type: "",
      subject_id: "",
      file: null
    });
    setEditingItem(null);
  };

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Lock className="h-6 w-6 text-primary" />
              Admin Access
            </CardTitle>
            <p className="text-muted-foreground">Enter password to access admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
                {authError && <p className="text-sm text-red-500 mt-2">{authError}</p>}
              </div>
              <Button type="submit" className="w-full">
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-16 w-16 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-blue-900">POLYPROS Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => loadAllData()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Question Papers Management</h1>
          <p className="text-gray-600">Manage regulations, semesters, branches, subjects, and question papers</p>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="regulations" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Regulations</span>
            </TabsTrigger>
            <TabsTrigger value="semesters" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Semesters</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Branches</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Subjects</span>
            </TabsTrigger>
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Papers</span>
            </TabsTrigger>
          </TabsList>

          {/* Regulations Tab */}
          <TabsContent value="regulations" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Regulations Management
                </CardTitle>
                <Dialog open={showDialog && activeTab === "regulations"} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForms(); setShowDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Regulation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Regulation" : "Add New Regulation"}
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regulations.map((regulation) => (
                      <TableRow key={regulation.id}>
                        <TableCell>
                          <Badge variant="outline">{regulation.code}</Badge>
                        </TableCell>
                        <TableCell>{regulation.name}</TableCell>
                        <TableCell>{regulation.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRegulation(regulation)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteRegulation(regulation.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Semesters Tab */}
          <TabsContent value="semesters" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Semesters Management
                </CardTitle>
                <Dialog open={showDialog && activeTab === "semesters"} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForms(); setShowDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Semester
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Semester" : "Add New Semester"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSemesterSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="number">Semester Number</Label>
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {semesters.map((semester) => (
                      <TableRow key={semester.id}>
                        <TableCell>
                          <Badge variant="outline">{semester.number}</Badge>
                        </TableCell>
                        <TableCell>{semester.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSemester(semester)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSemester(semester.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branches Tab */}
          <TabsContent value="branches" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Branches Management
                </CardTitle>
                <Dialog open={showDialog && activeTab === "branches"} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForms(); setShowDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Branch
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Branch" : "Add New Branch"}
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branches.map((branch) => (
                      <TableRow key={branch.id}>
                        <TableCell>
                          <Badge variant="outline">{branch.code}</Badge>
                        </TableCell>
                        <TableCell>{branch.name}</TableCell>
                        <TableCell>{branch.description || "-"}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditBranch(branch)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteBranch(branch.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Subjects Management
                </CardTitle>
                <Dialog open={showDialog && activeTab === "subjects"} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForms(); setShowDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Subject" : "Add New Subject"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubjectSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="code">Subject Code</Label>
                          <Input
                            id="code"
                            value={subjectForm.code}
                            onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                            placeholder="e.g., CM101"
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
                      <div className="grid grid-cols-3 gap-4">
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
                              {regulations.map((reg) => (
                                <SelectItem key={reg.id} value={reg.id}>
                                  {reg.code} - {reg.name}
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
                              {semesters.map((sem) => (
                                <SelectItem key={sem.id} value={sem.id}>
                                  {sem.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Regulation</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <Badge variant="outline">{subject.code}</Badge>
                        </TableCell>
                        <TableCell>{subject.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {subject.regulations?.code}
                          </Badge>
                        </TableCell>
                        <TableCell>{subject.semesters?.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {subject.branches?.code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSubject(subject)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubject(subject.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Question Papers Tab */}
          <TabsContent value="papers" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Question Papers Management
                </CardTitle>
                <Dialog open={showDialog && activeTab === "papers"} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => { resetForms(); setShowDialog(true); }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question Paper
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Question Paper" : "Add New Question Paper"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePaperSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={paperForm.title}
                          onChange={(e) => setPaperForm({...paperForm, title: e.target.value})}
                          placeholder="e.g., Programming in C - Mid Term Exam"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={paperForm.year}
                            onChange={(e) => setPaperForm({...paperForm, year: e.target.value})}
                            placeholder="2024"
                          />
                        </div>
                        <div>
                          <Label htmlFor="month">Month</Label>
                          <Select
                            value={paperForm.month}
                            onValueChange={(value) => setPaperForm({...paperForm, month: value})}
                          >
                            <SelectTrigger>
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
                          <Label htmlFor="exam_type">Exam Type</Label>
                          <Select
                            value={paperForm.exam_type}
                            onValueChange={(value) => setPaperForm({...paperForm, exam_type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Mid-term">Mid-term</SelectItem>
                              <SelectItem value="End-term">End-term</SelectItem>
                              <SelectItem value="Supplementary">Supplementary</SelectItem>
                              <SelectItem value="Regular">Regular</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={paperForm.subject_id}
                          onValueChange={(value) => setPaperForm({...paperForm, subject_id: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.code} - {subject.name} ({subject.regulations?.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="file">Question Paper File (PDF)</Label>
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setPaperForm({...paperForm, file: e.target.files?.[0] || null})}
                          className="cursor-pointer"
                        />
                        {editingItem && !paperForm.file && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Leave empty to keep existing file
                          </p>
                        )}
                      </div>
                      <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "Saving..." : editingItem ? "Update" : "Create"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Year/Month</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>File</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionPapers.map((paper) => (
                      <TableRow key={paper.id}>
                        <TableCell>{paper.title}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {paper.subjects?.code} - {paper.subjects?.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {paper.subjects?.regulations?.code} | {paper.subjects?.semesters?.name} | {paper.subjects?.branches?.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {paper.month} {paper.year}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{paper.exam_type}</Badge>
                        </TableCell>
                        <TableCell>
                          {paper.file_url ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Uploaded</span>
                              </div>
                              {paper.file_size && (
                                <div className="text-xs text-muted-foreground">
                                  {formatFileSize(paper.file_size)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">No file</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {paper.file_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(paper.file_url, '_blank')}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPaper(paper)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePaper(paper.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;