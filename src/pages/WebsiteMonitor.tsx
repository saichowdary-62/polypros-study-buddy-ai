import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Activity, Shield, Zap, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WebsiteMonitor = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem("monitor_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "amar") {
      setIsAuthenticated(true);
      localStorage.setItem("monitor_auth", "true");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("monitor_auth");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Lock className="h-6 w-6 text-primary" />
              Secure Access
            </CardTitle>
            <p className="text-muted-foreground">Enter password to access monitor</p>
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
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Access Monitor
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  const monitorData = {
    "Account_ID": "40db6d3fe352fe339efc6a256acab389",
    "API_Status": {
      "Max_API_Calls": 2000,
      "Remaining_API_Calls": 2000
    },
    "API_Blacklist_Check_Status": {
      "Monthly_API_Checks_From_Package": 100,
      "Spent_API_Checks_This_Month": 0,
      "Extra_API_Checks_Available": 0,
      "Total_API_Checks_Left": 100
    }
  };

  const apiUsagePercentage = ((monitorData.API_Status.Max_API_Calls - monitorData.API_Status.Remaining_API_Calls) / monitorData.API_Status.Max_API_Calls) * 100;
  const blacklistUsagePercentage = (monitorData.API_Blacklist_Check_Status.Spent_API_Checks_This_Month / monitorData.API_Blacklist_Check_Status.Monthly_API_Checks_From_Package) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80">
      {/* Header Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg fixed w-full top-0 z-50 border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-1">
              <img src="/polylogo-removebg-preview.png" alt="PolyPros Logo" className="h-16 w-16 object-contain" />
              <span className="text-xl sm:text-2xl font-bold text-blue-900">POLYPROS</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-6 pt-24 p-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Website Monitor
          </h1>
          <p className="text-muted-foreground">Real-time API monitoring and usage statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Account Info */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Account ID</p>
                  <p className="font-mono text-sm bg-muted p-2 rounded border">
                    {monitorData.Account_ID}
                  </p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* API Status */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                API Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{monitorData.API_Status.Max_API_Calls - monitorData.API_Status.Remaining_API_Calls} / {monitorData.API_Status.Max_API_Calls}</span>
                  </div>
                  <Progress value={apiUsagePercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-semibold text-green-600">{monitorData.API_Status.Remaining_API_Calls}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Calls</p>
                    <p className="font-semibold">{monitorData.API_Status.Max_API_Calls}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blacklist Check Status */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Security Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{monitorData.API_Blacklist_Check_Status.Spent_API_Checks_This_Month} / {monitorData.API_Blacklist_Check_Status.Monthly_API_Checks_From_Package}</span>
                  </div>
                  <Progress value={blacklistUsagePercentage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-semibold text-green-600">{monitorData.API_Blacklist_Check_Status.Total_API_Checks_Left}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Extra Available</p>
                    <p className="font-semibold">{monitorData.API_Blacklist_Check_Status.Extra_API_Checks_Available}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Detailed Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-2xl font-bold text-primary">{monitorData.API_Status.Remaining_API_Calls}</div>
                <div className="text-sm text-muted-foreground">API Calls Available</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{monitorData.API_Blacklist_Check_Status.Total_API_Checks_Left}</div>
                <div className="text-sm text-muted-foreground">Security Checks Left</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{apiUsagePercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">API Usage</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{blacklistUsagePercentage.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Security Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteMonitor;