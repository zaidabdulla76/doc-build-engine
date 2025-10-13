import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Brain, 
  Search, 
  Shield, 
  FileSearch, 
  Activity, 
  Bell,
  CheckCircle2,
  Loader2,
  Play,
  Pause,
  Settings
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const AIAgentsPanel = () => {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [agentStates, setAgentStates] = useState<Record<string, string>>({
    "Risk Assessment Agent": "active",
    "Data Collection Agent": "active",
    "Investigation Agent": "active",
    "Monitoring Agent": "active",
    "Alert Management Agent": "processing",
    "Compliance Agent": "active"
  });
  const agents = [
    {
      name: "Risk Assessment Agent",
      icon: Shield,
      tasks: 12,
      description: "Analyzing vendor risk profiles",
      details: "Currently processing risk assessments for 12 vendors using multi-factor analysis including financial health, compliance history, and market reputation."
    },
    {
      name: "Data Collection Agent",
      icon: Search,
      tasks: 8,
      description: "Gathering from 52 sources",
      details: "Actively collecting data from 52 external sources including financial databases, news feeds, regulatory filings, and social media."
    },
    {
      name: "Investigation Agent",
      icon: FileSearch,
      tasks: 5,
      description: "Deep analysis in progress",
      details: "Conducting in-depth investigations on 5 high-priority vendors, analyzing patterns, anomalies, and potential risk indicators."
    },
    {
      name: "Monitoring Agent",
      icon: Activity,
      tasks: 1247,
      description: "24/7 surveillance active",
      details: "Continuously monitoring 1,247 active vendors for any changes in risk profile, compliance status, or market conditions."
    },
    {
      name: "Alert Management Agent",
      icon: Bell,
      tasks: 3,
      description: "Processing new alerts",
      details: "Processing 3 new critical alerts requiring immediate attention. Prioritizing by risk severity and business impact."
    },
    {
      name: "Compliance Agent",
      icon: CheckCircle2,
      tasks: 23,
      description: "Regulatory compliance checks",
      details: "Verifying compliance with 23 different regulatory requirements across multiple jurisdictions for active vendors."
    }
  ];

  const toggleAgentStatus = (agentName: string) => {
    const currentStatus = agentStates[agentName];
    const newStatus = currentStatus === "active" ? "paused" : "active";
    
    setAgentStates(prev => ({ ...prev, [agentName]: newStatus }));
    
    toast({
      title: `Agent ${newStatus === "active" ? "Activated" : "Paused"}`,
      description: `${agentName} has been ${newStatus === "active" ? "activated" : "paused"}`
    });
  };

  return (
    <Card className="bg-gradient-card border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Agents System</h3>
            <p className="text-sm text-muted-foreground">Autonomous intelligence network</p>
          </div>
        </div>
        <Badge className="bg-success/10 text-success border-success/20">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const status = agentStates[agent.name];
          return (
            <div
              key={agent.name}
              className="bg-secondary/50 border border-border rounded-lg p-4 hover:bg-secondary transition-colors cursor-pointer group"
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center space-x-2">
                  {status === "active" ? (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <div className="h-2 w-2 rounded-full bg-success mr-1 animate-pulse" />
                      Active
                    </Badge>
                  ) : status === "processing" ? (
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Paused
                    </Badge>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-1">{agent.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {agent.tasks} active {agent.tasks === 1 ? 'task' : 'tasks'}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAgentStatus(agent.name);
                  }}
                >
                  {status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedAgent && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = selectedAgent.icon;
                      return <Icon className="h-5 w-5 text-primary" />;
                    })()}
                  </div>
                  <span>{selectedAgent.name}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Status</h4>
                <div className="flex items-center space-x-2">
                  {agentStates[selectedAgent.name] === "active" ? (
                    <Badge className="bg-success/10 text-success border-success/20">
                      <div className="h-2 w-2 rounded-full bg-success mr-1 animate-pulse" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-muted text-muted-foreground">Paused</Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {selectedAgent.tasks} active {selectedAgent.tasks === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedAgent.details}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                    <span className="text-sm text-foreground">Task completed</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                    <span className="text-sm text-foreground">New task assigned</span>
                    <span className="text-xs text-muted-foreground">15 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                    <span className="text-sm text-foreground">Data source updated</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => toggleAgentStatus(selectedAgent.name)}
                  variant="outline"
                  className="flex-1"
                >
                  {agentStates[selectedAgent.name] === "active" ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause Agent
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Activate Agent
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
