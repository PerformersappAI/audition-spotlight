import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = (redirectOnFail = true) => {
  const { user, userProfile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('useAdminAuth: State change', { loading, user: !!user, userProfile, redirectOnFail });
    
    if (!loading) {
      const adminStatus = userProfile?.role === 'admin';
      console.log('useAdminAuth: Admin status check', { adminStatus, role: userProfile?.role });
      
      setIsAdmin(adminStatus);
      setIsChecking(false);

      if (redirectOnFail && !adminStatus && user) {
        console.log('useAdminAuth: Redirecting non-admin user to home');
        navigate('/', { replace: true });
      }
    }
  }, [user, userProfile, loading, navigate, redirectOnFail]);

  return {
    isAdmin,
    isChecking: loading || isChecking,
    user,
    userProfile
  };
};