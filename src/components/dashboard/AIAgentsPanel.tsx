import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Search, 
  Shield, 
  FileSearch, 
  Activity, 
  Bell,
  CheckCircle2,
  Loader2
} from "lucide-react";

export const AIAgentsPanel = () => {
  const agents = [
    {
      name: "Risk Assessment Agent",
      icon: Shield,
      status: "active",
      tasks: 12,
      description: "Analyzing vendor risk profiles"
    },
    {
      name: "Data Collection Agent",
      icon: Search,
      status: "active",
      tasks: 8,
      description: "Gathering from 52 sources"
    },
    {
      name: "Investigation Agent",
      icon: FileSearch,
      status: "active",
      tasks: 5,
      description: "Deep analysis in progress"
    },
    {
      name: "Monitoring Agent",
      icon: Activity,
      status: "active",
      tasks: 1247,
      description: "24/7 surveillance active"
    },
    {
      name: "Alert Management Agent",
      icon: Bell,
      status: "processing",
      tasks: 3,
      description: "Processing new alerts"
    },
    {
      name: "Compliance Agent",
      icon: CheckCircle2,
      status: "active",
      tasks: 23,
      description: "Regulatory compliance checks"
    }
  ];

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
          return (
            <div
              key={agent.name}
              className="bg-secondary/50 border border-border rounded-lg p-4 hover:bg-secondary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {agent.status === "active" ? (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <div className="h-2 w-2 rounded-full bg-success mr-1 animate-pulse" />
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Processing
                  </Badge>
                )}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{agent.name}</h4>
              <p className="text-sm text-muted-foreground mb-2">{agent.description}</p>
              <div className="text-xs text-muted-foreground">
                {agent.tasks} active {agent.tasks === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
