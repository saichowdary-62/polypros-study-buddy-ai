import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Shield, Zap } from "lucide-react";

const WebsiteMonitor = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
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