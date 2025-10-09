import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Calendar, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface Regulation {
  id: string;
  code: string;
  name: string;
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
}

interface Subject {
  id: string;
  code: string;
  name: string;
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
  file_url: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

const QuestionPapers = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  
  const [selectedRegulation, setSelectedRegulation] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadRegulations();
    loadSemesters();
    loadBranches();
  }, []);

  // Load subjects when filters change
  useEffect(() => {
    if (selectedRegulation && selectedSemester && selectedBranch) {
      loadSubjects();
    } else {
      setSubjects([]);
      setSelectedSubject("");
    }
  }, [selectedRegulation, selectedSemester, selectedBranch]);

  // Load question papers when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadQuestionPapers();
    } else {
      setQuestionPapers([]);
    }
  }, [selectedSubject]);

  const loadRegulations = async () => {
    const { data, error } = await supabase
      .from('regulations')
      .select('*')
      .order('code');
    
    if (error) {
      toast({ title: "Error loading regulations", variant: "destructive" });
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
      toast({ title: "Error loading semesters", variant: "destructive" });
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
      toast({ title: "Error loading branches", variant: "destructive" });
      return;
    }
    
    setBranches(data || []);
  };

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('regulation_id', selectedRegulation)
      .eq('semester_id', selectedSemester)
      .eq('branch_id', selectedBranch)
      .order('code');
    
    if (error) {
      toast({ title: "Error loading subjects", variant: "destructive" });
      return;
    }
    
    setSubjects(data || []);
  };

  const loadQuestionPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('question_papers')
      .select('*')
      .eq('subject_id', selectedSubject)
      .order('year', { ascending: false });
    
    if (error) {
      toast({ title: "Error loading question papers", variant: "destructive" });
    } else {
      setQuestionPapers(data || []);
    }
    
    setLoading(false);
  };

  const handleDownload = async (paper: QuestionPaper) => {
    if (!paper.file_url) {
      toast({ title: "File not available", variant: "destructive" });
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = paper.file_url;
    link.download = paper.file_name || `${paper.title}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      <Navigation />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4 animate-slide-up">
              Previous Question Papers
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto px-4">
              Find and download question papers for SBTET AP diploma courses
            </p>
          </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Select Your Course Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Regulation */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Regulation</label>
                <Select value={selectedRegulation} onValueChange={setSelectedRegulation}>
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

              {/* Semester */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
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

              {/* Branch */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch</label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
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

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Papers */}
        {selectedSubject && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Available Question Papers
                {questionPapers.length > 0 && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({questionPapers.length} papers found)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-2">Loading question papers...</p>
                </div>
              ) : questionPapers.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No question papers found for this subject.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Papers will be added regularly. Check back later!
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {questionPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{paper.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {paper.month} {paper.year}
                          </span>
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                            {paper.exam_type}
                          </span>
                          {paper.file_size && (
                            <span>{formatFileSize(paper.file_size)}</span>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleDownload(paper)}
                        className="flex items-center gap-2 w-full sm:w-auto"
                        size="sm"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuestionPapers;