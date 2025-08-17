import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Upload, Download, RefreshCw, ArrowLeft, FileText, BookOpen, GraduationCap, Building } from "lucide-react";
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
  regulations?: Regulation;
  semesters?: Semester;
  branches?: Branch;
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
  subjects?: Subject;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for all entities
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form states
  const [editingRegulation, setEditingRegulation] = useState<Regulation | null>(null);
  const [editingSemester, setEditingSemester] = useState<Semester | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingQuestionPaper, setEditingQuestionPaper] = useState<QuestionPaper | null>(null);
  
  // Dialog states
  const [showRegulationDialog, setShowRegulationDialog] = useState(false);
  const [showSemesterDialog, setShowSemesterDialog] = useState(false);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showSubjectDialog, setShowSubjectDialog] = useState(false);
  const [showQuestionPaperDialog, setShowQuestionPaperDialog] = useState(false);

  // Form data
  const [regulationForm, setRegulationForm] = useState({ code: '', name: '', description: '' });
  const [semesterForm, setSemesterForm] = useState({ number: 0, name: '' });
  const [branchForm, setBranchForm] = useState({ code: '', name: '', description: '' });
  const [subjectForm, setSubjectForm] = useState({ 
    code: '', 
    name: '', 
    description: '', 
    regulation_id: '', 
    semester_id: '', 
    branch_id: '' 
  });
  const [questionPaperForm, setQuestionPaperForm] = useState({
    title: '',
    year: new Date().getFullYear(),
    month: '',
    exam_type: '',
    subject_id: '',
    file: null as File | null
  });

  useEffect(() => {
    loadAllData();
  }, []);

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
      console.error('Error loading data:', error);
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
      console.error('Error loading regulations:', error);
      return;
    }
    
    setRegulations(data || []);
  };

  const loadSemesters = async () => {
    const { data, error } = await supabase
      .from('semesters')
      .select('*')
      .order('number');
    
    if (error) {
      console.error('Error loading semesters:', error);
      return;
    }
    
    setSemesters(data || []);
  };

  const loadBranches = async () => {
    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('code');
    
    if (error) {
      console.error('Error loading branches:', error);
      return;
    }
    
    setBranches(data || []);
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select(`
        *,
        regulations(code, name),
        semesters(number, name),
        branches(code, name)
      `)
      .order('code');
    
    if (error) {
      console.error('Error loading subjects:', error);
      return;
    }
    
    setSubjects(data || []);
  };

  const loadQuestionPapers = async () => {
    const { data, error } = await supabase
      .from('question_papers')
      .select(`
        *,
        subjects(
          code,
          name,
          regulations(code, name),
          semesters(number, name),
          branches(code, name)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading question papers:', error);
      return;
    }
    
    setQuestionPapers(data || []);
  };

  // CRUD operations for Regulations
  const handleSaveRegulation = async () => {
    try {
      if (editingRegulation) {
        const { error } = await supabase
          .from('regulations')
          .update(regulationForm)
          .eq('id', editingRegulation.id);
        
        if (error) throw error;
        toast({ title: "Regulation updated successfully" });
      } else {
        const { error } = await supabase
          .from('regulations')
          .insert([regulationForm]);
        
        if (error) throw error;
        toast({ title: "Regulation created successfully" });
      }
      
      setShowRegulationDialog(false);
      setEditingRegulation(null);
      setRegulationForm({ code: '', name: '', description: '' });
      loadRegulations();
    } catch (error) {
      console.error('Error saving regulation:', error);
      toast({ title: "Error saving regulation", variant: "destructive" });
    }
  };

  const handleDeleteRegulation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('regulations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Regulation deleted successfully" });
      loadRegulations();
    } catch (error) {
      console.error('Error deleting regulation:', error);
      toast({ title: "Error deleting regulation", variant: "destructive" });
    }
  };

  // CRUD operations for Semesters
  const handleSaveSemester = async () => {
    try {
      if (editingSemester) {
        const { error } = await supabase
          .from('semesters')
          .update(semesterForm)
          .eq('id', editingSemester.id);
        
        if (error) throw error;
        toast({ title: "Semester updated successfully" });
      } else {
        const { error } = await supabase
          .from('semesters')
          .insert([semesterForm]);
        
        if (error) throw error;
        toast({ title: "Semester created successfully" });
      }
      
      setShowSemesterDialog(false);
      setEditingSemester(null);
      setSemesterForm({ number: 0, name: '' });
      loadSemesters();
    } catch (error) {
      console.error('Error saving semester:', error);
      toast({ title: "Error saving semester", variant: "destructive" });
    }
  };

  const handleDeleteSemester = async (id: string) => {
    try {
      const { error } = await supabase
        .from('semesters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Semester deleted successfully" });
      loadSemesters();
    } catch (error) {
      console.error('Error deleting semester:', error);
      toast({ title: "Error deleting semester", variant: "destructive" });
    }
  };

  // CRUD operations for Branches
  const handleSaveBranch = async () => {
    try {
      if (editingBranch) {
        const { error } = await supabase
          .from('branches')
          .update(branchForm)
          .eq('id', editingBranch.id);
        
        if (error) throw error;
        toast({ title: "Branch updated successfully" });
      } else {
        const { error } = await supabase
          .from('branches')
          .insert([branchForm]);
        
        if (error) throw error;
        toast({ title: "Branch created successfully" });
      }
      
      setShowBranchDialog(false);
      setEditingBranch(null);
      setBranchForm({ code: '', name: '', description: '' });
      loadBranches();
    } catch (error) {
      console.error('Error saving branch:', error);
      toast({ title: "Error saving branch", variant: "destructive" });
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Branch deleted successfully" });
      loadBranches();
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast({ title: "Error deleting branch", variant: "destructive" });
    }
  };

  // CRUD operations for Subjects
  const handleSaveSubject = async () => {
    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update(subjectForm)
          .eq('id', editingSubject.id);
        
        if (error) throw error;
        toast({ title: "Subject updated successfully" });
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert([subjectForm]);
        
        if (error) throw error;
        toast({ title: "Subject created successfully" });
      }
      
      setShowSubjectDialog(false);
      setEditingSubject(null);
      setSubjectForm({ 
        code: '', 
        name: '', 
        description: '', 
        regulation_id: '', 
        semester_id: '', 
        branch_id: '' 
      });
      loadSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({ title: "Error saving subject", variant: "destructive" });
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Subject deleted successfully" });
      loadSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({ title: "Error deleting subject", variant: "destructive" });
    }
  };

  // CRUD operations for Question Papers
  const handleSaveQuestionPaper = async () => {
    try {
      setUploading(true);
      
      let fileUrl = '';
      let fileName = '';
      let fileSize = 0;
      
      if (questionPaperForm.file) {
        const file = questionPaperForm.file;
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('question-papers')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('question-papers')
          .getPublicUrl(filePath);
        
        fileUrl = publicUrl;
        fileName = file.name;
        fileSize = file.size;
      }
      
      const paperData = {
        title: questionPaperForm.title,
        year: questionPaperForm.year,
        month: questionPaperForm.month,
        exam_type: questionPaperForm.exam_type,
        subject_id: questionPaperForm.subject_id,
        ...(fileUrl && { file_url: fileUrl, file_name: fileName, file_size: fileSize })
      };
      
      if (editingQuestionPaper) {
        const { error } = await supabase
          .from('question_papers')
          .update(paperData)
          .eq('id', editingQuestionPaper.id);
        
        if (error) throw error;
        toast({ title: "Question paper updated successfully" });
      } else {
        const { error } = await supabase
          .from('question_papers')
          .insert([paperData]);
        
        if (error) throw error;
        toast({ title: "Question paper created successfully" });
      }
      
      setShowQuestionPaperDialog(false);
      setEditingQuestionPaper(null);
      setQuestionPaperForm({
        title: '',
        year: new Date().getFullYear(),
        month: '',
        exam_type: '',
        subject_id: '',
        file: null
      });
      loadQuestionPapers();
    } catch (error) {
      console.error('Error saving question paper:', error);
      toast({ title: "Error saving question paper", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteQuestionPaper = async (id: string) => {
    try {
      const { error } = await supabase
        .from('question_papers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Question paper deleted successfully" });
      loadQuestionPapers();
    } catch (error) {
      console.error('Error deleting question paper:', error);
      toast({ title: "Error deleting question paper", variant: "destructive" });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-12 h-12 bg-purple-300 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-60 right-1/4 w-18 h-18 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600 animate-bounce" />
              <span className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">Admin Panel</span>
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
                variant="ghost" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-slide-up">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Manage regulations, semesters, branches, subjects, and question papers
            </p>
          </div>

          <Tabs defaultValue="regulations" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="regulations" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Regulations
              </TabsTrigger>
              <TabsTrigger value="semesters" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Semesters
              </TabsTrigger>
              <TabsTrigger value="branches" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Branches
              </TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Subjects
              </TabsTrigger>
              <TabsTrigger value="papers" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Question Papers
              </TabsTrigger>
            </TabsList>

            {/* Regulations Tab */}
            <TabsContent value="regulations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Regulations
                  </CardTitle>
                  <Dialog open={showRegulationDialog} onOpenChange={setShowRegulationDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingRegulation(null);
                          setRegulationForm({ code: '', name: '', description: '' });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Regulation
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingRegulation ? 'Edit Regulation' : 'Add New Regulation'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="reg-code">Code</Label>
                          <Input
                            id="reg-code"
                            value={regulationForm.code}
                            onChange={(e) => setRegulationForm({ ...regulationForm, code: e.target.value })}
                            placeholder="e.g., C20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reg-name">Name</Label>
                          <Input
                            id="reg-name"
                            value={regulationForm.name}
                            onChange={(e) => setRegulationForm({ ...regulationForm, name: e.target.value })}
                            placeholder="e.g., C20 Regulation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="reg-desc">Description</Label>
                          <Textarea
                            id="reg-desc"
                            value={regulationForm.description}
                            onChange={(e) => setRegulationForm({ ...regulationForm, description: e.target.value })}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button onClick={handleSaveRegulation} className="w-full">
                          {editingRegulation ? 'Update' : 'Create'} Regulation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regulations.map((regulation) => (
                      <div key={regulation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{regulation.code} - {regulation.name}</h3>
                          {regulation.description && (
                            <p className="text-sm text-muted-foreground">{regulation.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingRegulation(regulation);
                              setRegulationForm({
                                code: regulation.code,
                                name: regulation.name,
                                description: regulation.description || ''
                              });
                              setShowRegulationDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRegulation(regulation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Semesters Tab */}
            <TabsContent value="semesters">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Semesters
                  </CardTitle>
                  <Dialog open={showSemesterDialog} onOpenChange={setShowSemesterDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingSemester(null);
                          setSemesterForm({ number: 0, name: '' });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Semester
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingSemester ? 'Edit Semester' : 'Add New Semester'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="sem-number">Number</Label>
                          <Input
                            id="sem-number"
                            type="number"
                            value={semesterForm.number}
                            onChange={(e) => setSemesterForm({ ...semesterForm, number: parseInt(e.target.value) || 0 })}
                            placeholder="e.g., 1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sem-name">Name</Label>
                          <Input
                            id="sem-name"
                            value={semesterForm.name}
                            onChange={(e) => setSemesterForm({ ...semesterForm, name: e.target.value })}
                            placeholder="e.g., 1st Semester"
                          />
                        </div>
                        <Button onClick={handleSaveSemester} className="w-full">
                          {editingSemester ? 'Update' : 'Create'} Semester
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {semesters.map((semester) => (
                      <div key={semester.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{semester.name}</h3>
                          <Badge variant="outline">Semester {semester.number}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSemester(semester);
                              setSemesterForm({
                                number: semester.number,
                                name: semester.name
                              });
                              setShowSemesterDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSemester(semester.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Branches Tab */}
            <TabsContent value="branches">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Branches
                  </CardTitle>
                  <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingBranch(null);
                          setBranchForm({ code: '', name: '', description: '' });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Branch
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingBranch ? 'Edit Branch' : 'Add New Branch'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="branch-code">Code</Label>
                          <Input
                            id="branch-code"
                            value={branchForm.code}
                            onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                            placeholder="e.g., CME"
                          />
                        </div>
                        <div>
                          <Label htmlFor="branch-name">Name</Label>
                          <Input
                            id="branch-name"
                            value={branchForm.name}
                            onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                            placeholder="e.g., Computer Engineering"
                          />
                        </div>
                        <div>
                          <Label htmlFor="branch-desc">Description</Label>
                          <Textarea
                            id="branch-desc"
                            value={branchForm.description}
                            onChange={(e) => setBranchForm({ ...branchForm, description: e.target.value })}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button onClick={handleSaveBranch} className="w-full">
                          {editingBranch ? 'Update' : 'Create'} Branch
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {branches.map((branch) => (
                      <div key={branch.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{branch.code} - {branch.name}</h3>
                          {branch.description && (
                            <p className="text-sm text-muted-foreground">{branch.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBranch(branch);
                              setBranchForm({
                                code: branch.code,
                                name: branch.name,
                                description: branch.description || ''
                              });
                              setShowBranchDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteBranch(branch.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Subjects
                  </CardTitle>
                  <Dialog open={showSubjectDialog} onOpenChange={setShowSubjectDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingSubject(null);
                          setSubjectForm({ 
                            code: '', 
                            name: '', 
                            description: '', 
                            regulation_id: '', 
                            semester_id: '', 
                            branch_id: '' 
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Subject
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="subject-code">Code</Label>
                            <Input
                              id="subject-code"
                              value={subjectForm.code}
                              onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                              placeholder="e.g., CS101"
                            />
                          </div>
                          <div>
                            <Label htmlFor="subject-name">Name</Label>
                            <Input
                              id="subject-name"
                              value={subjectForm.name}
                              onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                              placeholder="e.g., Programming Fundamentals"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="subject-regulation">Regulation</Label>
                            <Select 
                              value={subjectForm.regulation_id} 
                              onValueChange={(value) => setSubjectForm({ ...subjectForm, regulation_id: value })}
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
                            <Label htmlFor="subject-semester">Semester</Label>
                            <Select 
                              value={subjectForm.semester_id} 
                              onValueChange={(value) => setSubjectForm({ ...subjectForm, semester_id: value })}
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
                            <Label htmlFor="subject-branch">Branch</Label>
                            <Select 
                              value={subjectForm.branch_id} 
                              onValueChange={(value) => setSubjectForm({ ...subjectForm, branch_id: value })}
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
                          <Label htmlFor="subject-desc">Description</Label>
                          <Textarea
                            id="subject-desc"
                            value={subjectForm.description}
                            onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button onClick={handleSaveSubject} className="w-full">
                          {editingSubject ? 'Update' : 'Create'} Subject
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{subject.code} - {subject.name}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{subject.regulations?.code}</Badge>
                            <Badge variant="outline">{subject.semesters?.name}</Badge>
                            <Badge variant="outline">{subject.branches?.code}</Badge>
                          </div>
                          {subject.description && (
                            <p className="text-sm text-muted-foreground mt-1">{subject.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingSubject(subject);
                              setSubjectForm({
                                code: subject.code,
                                name: subject.name,
                                description: subject.description || '',
                                regulation_id: subject.regulation_id,
                                semester_id: subject.semester_id,
                                branch_id: subject.branch_id
                              });
                              setShowSubjectDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSubject(subject.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Question Papers Tab */}
            <TabsContent value="papers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Question Papers
                  </CardTitle>
                  <Dialog open={showQuestionPaperDialog} onOpenChange={setShowQuestionPaperDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingQuestionPaper(null);
                          setQuestionPaperForm({
                            title: '',
                            year: new Date().getFullYear(),
                            month: '',
                            exam_type: '',
                            subject_id: '',
                            file: null
                          });
                        }}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Question Paper
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingQuestionPaper ? 'Edit Question Paper' : 'Add New Question Paper'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paper-title">Title</Label>
                          <Input
                            id="paper-title"
                            value={questionPaperForm.title}
                            onChange={(e) => setQuestionPaperForm({ ...questionPaperForm, title: e.target.value })}
                            placeholder="e.g., Mid-term Examination"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="paper-year">Year</Label>
                            <Input
                              id="paper-year"
                              type="number"
                              value={questionPaperForm.year}
                              onChange={(e) => setQuestionPaperForm({ ...questionPaperForm, year: parseInt(e.target.value) || new Date().getFullYear() })}
                              placeholder="2024"
                            />
                          </div>
                          <div>
                            <Label htmlFor="paper-month">Month</Label>
                            <Select 
                              value={questionPaperForm.month} 
                              onValueChange={(value) => setQuestionPaperForm({ ...questionPaperForm, month: value })}
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
                            <Label htmlFor="paper-exam-type">Exam Type</Label>
                            <Select 
                              value={questionPaperForm.exam_type} 
                              onValueChange={(value) => setQuestionPaperForm({ ...questionPaperForm, exam_type: value })}
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
                          <Label htmlFor="paper-subject">Subject</Label>
                          <Select 
                            value={questionPaperForm.subject_id} 
                            onValueChange={(value) => setQuestionPaperForm({ ...questionPaperForm, subject_id: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id}>
                                  {subject.code} - {subject.name} ({subject.regulations?.code}, {subject.semesters?.name}, {subject.branches?.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="paper-file">PDF File</Label>
                          <Input
                            id="paper-file"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setQuestionPaperForm({ ...questionPaperForm, file: e.target.files?.[0] || null })}
                          />
                        </div>
                        <Button 
                          onClick={handleSaveQuestionPaper} 
                          className="w-full"
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading...' : editingQuestionPaper ? 'Update' : 'Create'} Question Paper
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {questionPapers.map((paper) => (
                      <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{paper.title}</h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{paper.year}</Badge>
                            <Badge variant="outline">{paper.month}</Badge>
                            <Badge variant="outline">{paper.exam_type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {paper.subjects?.code} - {paper.subjects?.name}
                          </p>
                          {paper.file_size && (
                            <p className="text-xs text-muted-foreground">
                              File size: {formatFileSize(paper.file_size)}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
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
                            onClick={() => {
                              setEditingQuestionPaper(paper);
                              setQuestionPaperForm({
                                title: paper.title,
                                year: paper.year || new Date().getFullYear(),
                                month: paper.month || '',
                                exam_type: paper.exam_type || '',
                                subject_id: paper.subject_id,
                                file: null
                              });
                              setShowQuestionPaperDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteQuestionPaper(paper.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;