import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change event:', event, { user: !!session?.user });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile immediately
          const fetchProfile = async () => {
            try {
              console.log('useAuth: Fetching profile for user', session.user.id);
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (error) {
                console.log('useAuth: Profile fetch error', error);
                setUserProfile(null);
              } else {
                console.log('useAuth: Profile loaded', profile);
                setUserProfile(profile);
              }
            } catch (err) {
              console.log('useAuth: Profile fetch exception', err);
              setUserProfile(null);
            }
          };
          
          fetchProfile();
        } else {
          console.log('useAuth: No user session, clearing profile');
          setUserProfile(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial session check', { user: !!session?.user });
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => {
      console.log('useAuth: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/membership`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Starting sign out process');
      // Clear local state first
      setUser(null);
      setSession(null);
      setUserProfile(null);
      
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log('useAuth: Sign out error (non-critical):', error.message);
        // Don't throw error for session not found, as user is already logged out
        if (error.message.includes('session_not_found')) {
          console.log('useAuth: Session already cleared, sign out successful');
        }
      } else {
        console.log('useAuth: Sign out successful');
      }
    } catch (err) {
      console.log('useAuth: Sign out exception (non-critical):', err);
      // Even if there's an error, we still clear local state
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userProfile,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider. Current context:', context);
    console.error('AuthProvider should wrap the entire app in App.tsx');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};