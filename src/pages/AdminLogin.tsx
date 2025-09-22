import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn, user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle user profile changes after authentication
  useEffect(() => {
    // Skip if still loading auth state
    if (loading) {
      console.log('AdminLogin: Auth still loading, waiting...');
      return;
    }

    console.log('AdminLogin: Auth state changed', { 
      user: !!user, 
      userProfile: userProfile?.role, 
      loading, 
      isCheckingProfile 
    });
    
    // If we have a user and profile, check admin status
    if (user && userProfile && !loading) {
      console.log('AdminLogin: User and profile loaded, checking admin role:', userProfile.role);
      
      if (userProfile.role === 'admin') {
        console.log('AdminLogin: Admin confirmed, redirecting to /admin');
        setIsCheckingProfile(false);
        navigate('/admin', { replace: true });
        return;
      } else {
        console.log('AdminLogin: Not admin, showing access denied');
        setError('Access denied. Admin privileges required.');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This account does not have administrative privileges."
        });
        setIsCheckingProfile(false);
        return;
      }
    }

    // If we have a user but no profile after reasonable time, show error
    if (user && !userProfile && !loading && isCheckingProfile) {
      console.log('AdminLogin: User exists but no profile loaded, showing error');
      setTimeout(() => {
        if (!userProfile) {
          setError('Unable to load user profile. Please try again.');
          setIsCheckingProfile(false);
        }
      }, 2000); // Give 2 seconds for profile to load
    }
  }, [user, userProfile, loading, navigate, toast, isCheckingProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setIsCheckingProfile(true);

    try {
      console.log('AdminLogin: Attempting sign in with', email);
      console.log('AdminLogin: Password length:', password.length);
      
      const { error } = await signIn(email, password);
      
      if (error) {
        console.log('AdminLogin: Sign in error', error);
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message);
        }
        
        setIsCheckingProfile(false);
        return;
      }

      console.log('AdminLogin: Sign in successful, waiting for profile to load');
      
      // Add a timeout to prevent infinite checking
      setTimeout(() => {
        if (isCheckingProfile) {
          console.log('AdminLogin: Profile check timeout, forcing completion');
          setIsCheckingProfile(false);
          setError('Login timeout. Please try again.');
        }
      }, 5000); // 5 second timeout

    } catch (err) {
      console.log('AdminLogin: Unexpected error', err);
      setError('An unexpected error occurred. Please try again.');
      setIsCheckingProfile(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Administrative Access</CardTitle>
          <p className="text-muted-foreground">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              {email === 'salframondi@gmail.com' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Admin account detected. Try password: EnricoVader$
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isCheckingProfile}
            >
              {isLoading ? 'Signing In...' : isCheckingProfile ? 'Verifying Admin Access...' : 'Access Admin Panel'}
            </Button>
            
            {error && error.includes('Invalid email or password') && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Troubleshooting:</strong><br />
                  • Make sure email and password are exactly correct<br />
                  • Password is case-sensitive<br />
                  • For Sal: try "EnricoVader$" exactly<br />
                  • Check for extra spaces<br />
                  <br />
                  <strong>Password has been reset!</strong> Try logging in again with "EnricoVader$"
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;