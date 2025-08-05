import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Edit, Trash2, Upload, Download, FileText, Settings, Database, BookOpen, GraduationCap, Building2, Bot } from "lucide-react";
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
  
  // Form states
  const [regulationForm, setRegulationForm] = useState({ code: "", name: "", description: "" });
  const [semesterForm, setSemesterForm] = useState({ number: "", name: "" });
  const [branchForm, setBranchForm] = useState({ code: "", name: "", description: "" });
  const [subjectForm, setSubjectForm] = useState({ code: "", name: "", description: "", regulation_id: "", semester_id: "", branch_id: "" });
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
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

  // Load all data on component mount
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
      subject.semester_id === uploadForm.semester_id &&
      subject.branch_id === uploadForm.branch_id
    );
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
              <span className="text-2xl font-bold text-blue-900 hover:text-blue-700 transition-colors duration-300">PolyPros Admin</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
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
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="regulations" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Regulations
              </TabsTrigger>
              <TabsTrigger value="semesters" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Semesters
              </TabsTrigger>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Regulation Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Add New Regulation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Code (e.g., C20)"
                      value={newRegulation.code}
                      onChange={(e) => setNewRegulation({...newRegulation, code: e.target.value})}
                    />
                    <Input
                      placeholder="Name"
                      value={newRegulation.name}
                      onChange={(e) => setNewRegulation({...newRegulation, name: e.target.value})}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newRegulation.description}
                      onChange={(e) => setNewRegulation({...newRegulation, description: e.target.value})}
                    />
                    <Button 
                      onClick={editingRegulation ? handleUpdateRegulation : handleAddRegulation} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Processing..." : editingRegulation ? "Update Regulation" : "Add Regulation"}
                    </Button>
                    {editingRegulation && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingRegulation(null);
                          setNewRegulation({code: '', name: '', description: ''});
                        }}
                        className="w-full"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Regulations List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Regulations ({regulations.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : regulations.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No regulations found</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {regulations.map((regulation) => (
                          <div key={regulation.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-blue-900">{regulation.code}</div>
                                <div className="text-sm text-gray-600">{regulation.name}</div>
                                {regulation.description && (
                                  <div className="text-xs text-gray-500 mt-1">{regulation.description}</div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingRegulation(regulation);
                                    setNewRegulation({
                                      code: regulation.code, 
                                      name: regulation.name, 
                                      description: regulation.description || ''
                                    });
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
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingRegulation(regulation);
                              setRegulationForm({
                                code: regulation.code,
                                name: regulation.name,
                                description: regulation.description || ""
                              });
                              setShowRegulationDialog(true);
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
                                <AlertDialogTitle>Delete Regulation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this regulation? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteRegulation(regulation.id)}>
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

            {/* Semesters Tab */}
            <TabsContent value="semesters" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Semester Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Add New Semester
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      type="number"
                      placeholder="Number (e.g., 1)"
                      value={newSemester.number || ''}
                      onChange={(e) => setNewSemester({...newSemester, number: parseInt(e.target.value) || 0})}
                    />
                    <Input
                      placeholder="Name (e.g., 1st Semester)"
                      value={newSemester.name}
                      onChange={(e) => setNewSemester({...newSemester, name: e.target.value})}
                    />
                    <Button 
                      onClick={editingSemester ? handleUpdateSemester : handleAddSemester} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Processing..." : editingSemester ? "Update Semester" : "Add Semester"}
                    </Button>
                    {editingSemester && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingSemester(null);
                          setNewSemester({number: 0, name: ''});
                        }}
                        className="w-full"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Semesters List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Semesters ({semesters.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : semesters.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No semesters found</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {semesters.map((semester) => (
                          <div key={semester.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-blue-900">Semester {semester.number}</div>
                                <div className="text-sm text-gray-600">{semester.name}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSemester(semester);
                                    setNewSemester({number: semester.number, name: semester.name});
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
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                              setEditingSemester(semester);
                              setSemesterForm({
                                number: semester.number.toString(),
                                name: semester.name
                              });
                              setShowSemesterDialog(true);
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
                                <AlertDialogTitle>Delete Semester</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this semester? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSemester(semester.id)}>
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

            {/* Branches Tab */}
            <TabsContent value="branches" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Branch Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Add New Branch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Code (e.g., CME)"
                      value={newBranch.code}
                      onChange={(e) => setNewBranch({...newBranch, code: e.target.value})}
                    />
                    <Input
                      placeholder="Name"
                      value={newBranch.name}
                      onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                    />
                    <Input
                      placeholder="Description (optional)"
                      value={newBranch.description}
                      onChange={(e) => setNewBranch({...newBranch, description: e.target.value})}
                    />
                    <Button 
                      onClick={editingBranch ? handleUpdateBranch : handleAddBranch} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Processing..." : editingBranch ? "Update Branch" : "Add Branch"}
                    </Button>
                    {editingBranch && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingBranch(null);
                          setNewBranch({code: '', name: '', description: ''});
                        }}
                        className="w-full"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Branches List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Branches ({branches.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : branches.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No branches found</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {branches.map((branch) => (
                          <div key={branch.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-blue-900">{branch.code}</div>
                                <div className="text-sm text-gray-600">{branch.name}</div>
                                {branch.description && (
                                  <div className="text-xs text-gray-500 mt-1">{branch.description}</div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingBranch(branch);
                                    setNewBranch({
                                      code: branch.code, 
                                      name: branch.name, 
                                      description: branch.description || ''
                                    });
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
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingBranch(branch);
                              setBranchForm({
                                code: branch.code,
                                name: branch.name,
                                description: branch.description || ""
                              });
                              setShowBranchDialog(true);
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
                                <AlertDialogTitle>Delete Branch</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this branch? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteBranch(branch.id)}>
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

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Subject Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Add New Subject
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={newSubject.regulation_id} onValueChange={(value) => setNewSubject({...newSubject, regulation_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Regulation" />
                      </SelectTrigger>
                      <SelectContent>
                        {regulations.map((reg) => (
                          <SelectItem key={reg.id} value={reg.id}>{reg.code} - {reg.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={newSubject.semester_id} onValueChange={(value) => setNewSubject({...newSubject, semester_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((sem) => (
                          <SelectItem key={sem.id} value={sem.id}>{sem.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={newSubject.branch_id} onValueChange={(value) => setNewSubject({...newSubject, branch_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>{branch.code} - {branch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Subject Code"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                    />
                    
                    <Input
                      placeholder="Subject Name"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    />
                    
                    <Input
                      placeholder="Description (optional)"
                      value={newSubject.description}
                      onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                    />
                    
                    <Button 
                      onClick={editingSubject ? handleUpdateSubject : handleAddSubject} 
                      disabled={loading}
                      className="w-full"
                    >
                      {loading ? "Processing..." : editingSubject ? "Update Subject" : "Add Subject"}
                    </Button>
                    {editingSubject && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setEditingSubject(null);
                          setNewSubject({
                            regulation_id: '', semester_id: '', branch_id: '', 
                            code: '', name: '', description: ''
                          });
                        }}
                        className="w-full"
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Subjects List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Existing Subjects ({subjects.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">Loading...</div>
                    ) : subjects.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No subjects found</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {subjects.map((subject) => (
                          <div key={subject.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-blue-900">{subject.code}</div>
                                <div className="text-sm text-gray-600">{subject.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {regulations.find(r => r.id === subject.regulation_id)?.code} | 
                                  {semesters.find(s => s.id === subject.semester_id)?.name} | 
                                  {branches.find(b => b.id === subject.branch_id)?.code}
                                </div>
                                {subject.description && (
                                  <div className="text-xs text-gray-500 mt-1">{subject.description}</div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditingSubject(subject);
                                    setNewSubject({
                                      regulation_id: subject.regulation_id,
                                      semester_id: subject.semester_id,
                                      branch_id: subject.branch_id,
                                      code: subject.code,
                                      name: subject.name,
                                      description: subject.description || ''
                                    });
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteSubject(subject.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
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
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Question Papers Management
                  </CardTitle>
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Question Paper
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
                  <div className="grid gap-4">
                    {questionPapers.map((paper) => (
                      <div key={paper.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <h3 className="font-semibold">{paper.title}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Subject: {getSubjectName(paper.subject_id)}</p>
                            {paper.year && paper.month && (
                              <p>Date: {paper.month} {paper.year}</p>
                            )}
                            {paper.exam_type && (
                              <p>Type: {paper.exam_type}</p>
                            )}
                            {paper.file_size && (
                              <p>Size: {formatFileSize(paper.file_size)}</p>
                            )}
                          </div>
                        </div>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
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