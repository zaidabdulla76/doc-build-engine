import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AccessDeniedProps {
  requiredRole?: string;
  message?: string;
}

export const AccessDenied = ({ 
  requiredRole = "appropriate role", 
  message = "You don't have permission to access this page."
}: AccessDeniedProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="p-12 text-center max-w-md">
        <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground mb-4">{message}</p>
        <p className="text-sm text-muted-foreground mb-6">
          This page requires <span className="font-semibold">{requiredRole}</span> access level.
        </p>
        <Button onClick={() => navigate("/")} className="w-full">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </Card>
    </div>
  );
};
