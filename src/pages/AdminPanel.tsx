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
import { ArrowLeft, Plus, Edit, Trash2, Upload, FileText, Settings, Shield } from "lucide-react";
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
  year: number;
  month: string;
  exam_type: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  subject_id: string;
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
    const { data } = await supabase.from('regulations').select('*').order('code');
    setRegulations(data || []);
  };

  const loadSemesters = async () => {
    const { data } = await supabase.from('semesters').select('*').order('number');
    setSemesters(data || []);
  };

  const loadBranches = async () => {
    const { data } = await supabase.from('branches').select('*').order('code');
    setBranches(data || []);
  };

  const loadSubjects = async () => {
    const { data } = await supabase
      .from('subjects')
      .select(`
        *,
        regulations(code, name),
        semesters(name),
        branches(code, name)
      `)
      .order('code');
    setSubjects(data || []);
  };

  const loadQuestionPapers = async () => {
    const { data } = await supabase
      .from('question_papers')
      .select(`
        *,
        subjects(code, name)
      `)
      .order('created_at', { ascending: false });
    setQuestionPapers(data || []);
  };

  const handleSave = async (data: any, table: 'regulations' | 'semesters' | 'branches' | 'subjects' | 'question_papers') => {
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
  };

  const handleDelete = async (id: string, table: 'regulations' | 'semesters' | 'branches' | 'subjects' | 'question_papers') => {
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
  };

  const handleFileUpload = async (file: File, paperData: any) => {
    setUploading(true);

    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `papers/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('question-papers')
      .upload(filePath, file);

    if (uploadError) {
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
      ...paperData,
      file_url: publicUrl,
      file_name: file.name,
      file_size: file.size,
    };

    await handleSave(questionPaperData, 'question_papers');
    setUploading(false);
  };

  const RegulationForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="code">Code</Label>
        <Input
          id="code"
          defaultValue={editingItem?.code || ''}
          placeholder="e.g., C20"
        />
      </div>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          defaultValue={editingItem?.name || ''}
          placeholder="e.g., Curriculum 2020 Regulation"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          defaultValue={editingItem?.description || ''}
          placeholder="Optional description"
        />
      </div>
      <Button
        onClick={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          const formData = new FormData(form);
          const data = {
            code: (document.getElementById('code') as HTMLInputElement).value,
            name: (document.getElementById('name') as HTMLInputElement).value,
            description: (document.getElementById('description') as HTMLTextAreaElement).value,
          };
          handleSave(data, 'regulations');
        }}
      >
        {editingItem?.id ? 'Update' : 'Create'} Regulation
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Manage question papers database
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Database Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="regulations">Regulations</TabsTrigger>
                <TabsTrigger value="semesters">Semesters</TabsTrigger>
                <TabsTrigger value="branches">Branches</TabsTrigger>
                <TabsTrigger value="subjects">Subjects</TabsTrigger>
                <TabsTrigger value="papers">Question Papers</TabsTrigger>
              </TabsList>

              <TabsContent value="regulations" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Regulations</h3>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => {
                          setEditingItem(null);
                          setDialogOpen(true);
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
                          {editingItem?.id ? 'Edit' : 'Add'} Regulation
                        </DialogTitle>
                      </DialogHeader>
                      <form>
                        <RegulationForm />
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

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
                        <TableCell className="font-medium">{regulation.code}</TableCell>
                        <TableCell>{regulation.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{regulation.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingItem(regulation);
                                setDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(regulation.id, 'regulations')}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Similar tabs for other entities would go here */}
              <TabsContent value="papers" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Question Papers</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Paper
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Upload Question Paper</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="paper-file">Select PDF File</Label>
                          <Input
                            id="paper-file"
                            type="file"
                            accept=".pdf"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="paper-title">Title</Label>
                          <Input
                            id="paper-title"
                            placeholder="e.g., Mid-term Examination 2023"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="paper-year">Year</Label>
                            <Input
                              id="paper-year"
                              type="number"
                              placeholder="2023"
                            />
                          </div>
                          <div>
                            <Label htmlFor="paper-month">Month</Label>
                            <Input
                              id="paper-month"
                              placeholder="March"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="paper-type">Exam Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mid-term">Mid-term</SelectItem>
                              <SelectItem value="end-term">End-term</SelectItem>
                              <SelectItem value="supplementary">Supplementary</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={() => {
                            // Handle file upload logic here
                            toast({
                              title: "Upload functionality",
                              description: "File upload will be implemented",
                            });
                          }}
                          disabled={uploading}
                          className="w-full"
                        >
                          {uploading ? "Uploading..." : "Upload Paper"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {questionPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{paper.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {paper.month} {paper.year} • {paper.exam_type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(paper.id, 'question_papers')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;