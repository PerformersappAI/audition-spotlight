import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  
  const { signIn, user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle user profile changes after authentication
  useEffect(() => {
    console.log('AdminLogin: Auth state changed', { user: !!user, userProfile, loading, isCheckingProfile });
    
    if (user && userProfile && !loading && !isCheckingProfile) {
      console.log('AdminLogin: Checking admin role', userProfile.role);
      
      if (userProfile.role === 'admin') {
        console.log('AdminLogin: Admin confirmed, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('AdminLogin: Not admin, showing access denied');
        setError('Access denied. Admin privileges required.');
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This account does not have administrative privileges."
        });
        setIsCheckingProfile(false);
      }
    }
  }, [user, userProfile, loading, navigate, toast, isCheckingProfile]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setIsCheckingProfile(true);

    try {
      console.log('AdminLogin: Attempting sign in with', email);
      const { error } = await signIn(email, password);
      
      if (error) {
        console.log('AdminLogin: Sign in error', error.message);
        setError(error.message);
        setIsCheckingProfile(false);
        return;
      }

      console.log('AdminLogin: Sign in successful, waiting for profile to load');
      // Profile checking will be handled by useEffect when userProfile updates

    } catch (err) {
      console.log('AdminLogin: Unexpected error', err);
      setError('An unexpected error occurred');
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isCheckingProfile}
            >
              {isLoading ? 'Signing In...' : isCheckingProfile ? 'Verifying Admin Access...' : 'Access Admin Panel'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;