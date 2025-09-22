import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = (redirectOnFail = true) => {
  const { user, userProfile, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      const adminStatus = userProfile?.role === 'admin';
      setIsAdmin(adminStatus);
      setIsChecking(false);

      if (redirectOnFail && !adminStatus && user) {
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