import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useAdminAuth = (redirectOnFail = true) => {
  const { user, userProfile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminRole = async () => {
      console.log('useAdminAuth: State change', { loading, user: !!user, redirectOnFail });
      
      if (!loading && user) {
        // Check the user_roles table using the has_role function
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });
        
        console.log('useAdminAuth: Admin role check result', { data, error });
        
        const adminStatus = data === true;
        setIsAdmin(adminStatus);
        setIsChecking(false);

        if (redirectOnFail && !adminStatus) {
          console.log('useAdminAuth: Redirecting non-admin user to home');
          navigate('/', { replace: true });
        }
      } else if (!loading && !user) {
        setIsAdmin(false);
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [user, loading, navigate, redirectOnFail]);

  return {
    isAdmin,
    isChecking: loading || isChecking,
    user,
    userProfile
  };
};