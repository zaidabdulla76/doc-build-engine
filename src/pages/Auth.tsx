import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, Briefcase } from "lucide-react";
import { AppRole, roleLabels, roleDescriptions } from "@/hooks/useUserRoles";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole | "">("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
      navigate("/");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !fullName || !selectedRole) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select your role",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: fullName,
          requested_role: selectedRole,
        }
      },
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Signup Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Assign the selected role to the user
    if (data.user) {
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: data.user.id,
          role: selectedRole,
        });

      if (roleError) {
        console.error("Role assignment error:", roleError);
        toast({
          title: "Warning",
          description: "Account created but role assignment failed. Please contact an administrator.",
          variant: "destructive",
        });
      }
    }

    setLoading(false);

    toast({
      title: "Success",
      description: "Account created successfully! You can now log in.",
    });
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setSelectedRole("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Due Diligence Platform
          </h1>
          <p className="text-muted-foreground mt-2">AI-Powered Counterparty Analysis</p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm font-semibold text-foreground mb-3">Demo Accounts (Password: demo123)</p>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("procurement@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">Procurement Director:</span>
                        <span className="text-muted-foreground ml-2">procurement@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("category@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">Category Manager:</span>
                        <span className="text-muted-foreground ml-2">category@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("compliance@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">Compliance Officer:</span>
                        <span className="text-muted-foreground ml-2">compliance@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("gcc@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">GCC Leader:</span>
                        <span className="text-muted-foreground ml-2">gcc@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("security@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">IT Security Officer:</span>
                        <span className="text-muted-foreground ml-2">security@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("legal@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">Legal Team:</span>
                        <span className="text-muted-foreground ml-2">legal@demo.com</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail("finance@demo.com");
                          setPassword("demo123");
                        }}
                        className="text-left px-3 py-2 bg-background hover:bg-accent/10 rounded border border-border transition-colors"
                      >
                        <span className="font-medium text-foreground">Finance Team:</span>
                        <span className="text-muted-foreground ml-2">finance@demo.com</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground p-3 bg-secondary/20 rounded-md border border-border/50">
                    <p className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Your role and permissions are automatically loaded after login
                    </p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name *</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email *</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role-select">Your Role *</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value: AppRole) => setSelectedRole(value)}
                      disabled={loading}
                    >
                      <SelectTrigger id="role-select">
                        <SelectValue placeholder="Select your role in the organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.entries(roleLabels) as [AppRole, string][]).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex flex-col items-start py-1">
                              <div className="font-medium flex items-center gap-2">
                                <Briefcase className="h-3 w-3" />
                                {label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {roleDescriptions[value]}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password *</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Secure authentication powered by advanced encryption
        </p>
      </div>
    </div>
  );
};

export default Auth;
