import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Plus, Edit, Trash2, Upload, Download, Lock, Shield, Database, FileText, BookOpen, GraduationCap, Calendar } from "lucide-react";
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
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Form data
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
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
      console.error('Error loading data:', error);
      toast({ title: "Error loading data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadRegulations = async () => {
    const { data, error } = await supabase.from('regulations').select('*').order('code');
    if (error) throw error;
    setRegulations(data || []);
  };

  const loadSemesters = async () => {
    const { data, error } = await supabase.from('semesters').select('*').order('number');
    if (error) throw error;
    setSemesters(data || []);
  };

  const loadBranches = async () => {
    const { data, error } = await supabase.from('branches').select('*').order('code');
    if (error) throw error;
    setBranches(data || []);
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase.from('subjects').select('*').order('code');
    if (error) throw error;
    setSubjects(data || []);
  };

  const loadQuestionPapers = async () => {
    const { data, error } = await supabase.from('question_papers').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    setQuestionPapers(data || []);
  };

  const handleAdd = async (table: string, data: any) => {
    try {
      const { error } = await supabase.from(table).insert([data]);
      if (error) throw error;
      
      toast({ title: "Added successfully" });
      setShowAddDialog(false);
      setFormData({});
      loadAllData();
    } catch (error) {
      console.error('Error adding:', error);
      toast({ title: "Error adding item", variant: "destructive" });
    }
  };

  const handleEdit = async (table: string, id: string, data: any) => {
    try {
      const { error } = await supabase.from(table).update(data).eq('id', id);
      if (error) throw error;
      
      toast({ title: "Updated successfully" });
      setEditingItem(null);
      setFormData({});
      loadAllData();
    } catch (error) {
      console.error('Error updating:', error);
      toast({ title: "Error updating item", variant: "destructive" });
    }
  };

  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Deleted successfully" });
      loadAllData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ title: "Error deleting item", variant: "destructive" });
    }
  };

  const handleFileUpload = async (file: File, subjectId: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('question-papers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('question-papers')
        .getPublicUrl(filePath);

      return { url: publicUrl, fileName: file.name, fileSize: file.size };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl sm:text-2xl">
              <Lock className="h-6 w-6 text-primary" />
              Admin Access
            </CardTitle>
            <p className="text-muted-foreground text-sm sm:text-base">Enter password to access admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
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
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <span className="text-lg sm:text-xl font-bold text-blue-900">Admin Panel</span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                size="sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
              <Button variant="outline" onClick={handleLogout} size="sm" className="text-xs sm:text-sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 mb-2">
              Question Papers Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage regulations, semesters, branches, subjects, and question papers
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6">
            <Card className="text-center">
              <CardContent className="p-3 sm:p-6">
                <Database className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-blue-900">{regulations.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Regulations</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 sm:p-6">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-green-900">{semesters.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Semesters</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 sm:p-6">
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-purple-900">{branches.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Branches</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3 sm:p-6">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-orange-900">{subjects.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Subjects</div>
              </CardContent>
            </Card>
            <Card className="text-center col-span-2 lg:col-span-1">
              <CardContent className="p-3 sm:p-6">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 mx-auto mb-2" />
                <div className="text-lg sm:text-2xl font-bold text-red-900">{questionPapers.length}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Papers</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto">
              <TabsTrigger value="regulations" className="text-xs sm:text-sm p-2 sm:p-3">Regulations</TabsTrigger>
              <TabsTrigger value="semesters" className="text-xs sm:text-sm p-2 sm:p-3">Semesters</TabsTrigger>
              <TabsTrigger value="branches" className="text-xs sm:text-sm p-2 sm:p-3">Branches</TabsTrigger>
              <TabsTrigger value="subjects" className="text-xs sm:text-sm p-2 sm:p-3">Subjects</TabsTrigger>
              <TabsTrigger value="papers" className="text-xs sm:text-sm p-2 sm:p-3 col-span-2 lg:col-span-1">Papers</TabsTrigger>
            </TabsList>

            {/* Regulations Tab */}
            <TabsContent value="regulations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Regulations Management</CardTitle>
                  <Dialog open={showAddDialog && activeTab === 'regulations'} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="text-xs sm:text-sm">
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Add Regulation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Regulation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="code">Code</Label>
                          <Input
                            id="code"
                            value={formData.code || ''}
                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                            placeholder="e.g., C20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g., C20 Regulation"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Optional description"
                          />
                        </div>
                        <Button 
                          onClick={() => handleAdd('regulations', formData)}
                          className="w-full"
                        >
                          Add Regulation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Code</TableHead>
                          <TableHead className="text-xs sm:text-sm">Name</TableHead>
                          <TableHead className="hidden sm:table-cell text-xs sm:text-sm">Description</TableHead>
                          <TableHead className="text-xs sm:text-sm">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {regulations.map((regulation) => (
                          <TableRow key={regulation.id}>
                            <TableCell className="text-xs sm:text-sm font-medium">{regulation.code}</TableCell>
                            <TableCell className="text-xs sm:text-sm">{regulation.name}</TableCell>
                            <TableCell className="hidden sm:table-cell text-xs sm:text-sm">{regulation.description}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1 sm:space-x-2">
                                <Button variant="outline" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-600 hover:text-red-700">
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
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
                                      <AlertDialogAction onClick={() => handleDelete('regulations', regulation.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Similar structure for other tabs... */}
            <TabsContent value="semesters">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Semesters Management</CardTitle>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Semester
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Semesters management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="branches">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Branches Management</CardTitle>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Branch
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Branches management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Subjects Management</CardTitle>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Add Subject
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Subjects management interface will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="papers">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg sm:text-xl">Question Papers Management</CardTitle>
                  <Button size="sm" className="text-xs sm:text-sm">
                    <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Upload Paper
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    Question papers management interface will be implemented here
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