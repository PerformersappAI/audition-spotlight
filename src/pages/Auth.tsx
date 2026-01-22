import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Film, Users, Crown, Eye, EyeOff, Mail, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState<"filmmaker" | "film_festival">("filmmaker");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showResendSection, setShowResendSection] = useState(false);
  
  const { signUp, signIn: authSignIn } = useAuth();

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      role
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign Up Error",
        description: error.message
      });
    } else {
      // Send welcome email
      try {
        const { data: { publicUrl } } = supabase.storage.from('certificates').getPublicUrl('');
        const supabaseUrl = publicUrl.replace('/storage/v1/object/public/certificates/', '');
        
        await fetch(`${supabaseUrl}/functions/v1/send-welcome-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            firstName
          })
        });
        console.log('Welcome email triggered');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
        // Don't block signup if welcome email fails
      }
      
      toast({
        title: "Success!",
        description: "Please check your email to confirm your account"
      });
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter email and password"
      });
      return;
    }

    setLoading(true);
    const { error, data } = await signIn(email, password);

    if (error) {
      toast({
        variant: "destructive",
        title: "Sign In Error",
        description: error.message
      });
      setLoading(false);
      return;
    }

    // Check if user has credits
    const userId = data?.user?.id;
    if (userId) {
      const { data: credits } = await supabase
        .from('user_credits')
        .select('available_credits')
        .eq('user_id', userId)
        .maybeSingle();

      const { data: usage } = await supabase
        .from('user_usage')
        .select('credits_remaining')
        .eq('user_id', userId)
        .maybeSingle();

      const hasCredits = (credits?.available_credits || 0) > 0 || 
                         (usage?.credits_remaining || 0) > 0;

      if (!hasCredits) {
        navigate('/membership');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!resendEmail) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your email address"
      });
      return;
    }

    setResendLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: resendEmail,
      options: {
        emailRedirectTo: window.location.origin
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message
      });
    } else {
      toast({
        title: "Email Sent!",
        description: "Please check your inbox for the verification email"
      });
      setResendEmail("");
      setShowResendSection(false);
    }
    setResendLoading(false);
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case "filmmaker":
        return <Film className="h-4 w-4" />;
      case "film_festival":
        return <Users className="h-4 w-4" />;
      case "admin":
        return <Crown className="h-4 w-4" />;
      default:
        return <Film className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Cast</h1>
          <p className="text-muted-foreground mt-3 text-lg">Connect filmmakers, actors, and festivals</p>
        </div>

        <Card className="p-4">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 text-lg">
                <TabsTrigger value="signin" className="text-lg">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-lg">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label htmlFor="signin-email" className="text-lg">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-14 text-lg px-4"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="signin-password" className="text-lg">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pr-12 h-14 text-lg px-4"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-4 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSignIn} 
                  disabled={loading} 
                  className="w-full h-14 text-xl font-bold"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>

                <Collapsible open={showResendSection} onOpenChange={setShowResendSection}>
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="w-full text-sm text-muted-foreground hover:text-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      Didn't receive verification email?
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-2">
                    <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Enter your email address and we'll send you a new verification link.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="resend-email">Email Address</Label>
                        <Input
                          id="resend-email"
                          type="email"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <Button 
                        onClick={handleResendVerification} 
                        disabled={resendLoading}
                        variant="secondary"
                        className="w-full"
                      >
                        {resendLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Resend Verification Email
                          </>
                        )}
                      </Button>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization (Optional)</Label>
                  <Input
                    id="company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company or organization name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select value={role} onValueChange={(value: "filmmaker" | "film_festival") => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="filmmaker">
                        <div className="flex items-center gap-2">
                          {getRoleIcon("filmmaker")}
                          Filmmaker/Director
                        </div>
                      </SelectItem>
                      <SelectItem value="film_festival">
                        <div className="flex items-center gap-2">
                          {getRoleIcon("film_festival")}
                          Film Festival Organizer
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSignUp} 
                  disabled={loading} 
                  className="w-full"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;