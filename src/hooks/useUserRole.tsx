
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const { user } = useAuthContext();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      console.log('useUserRole: Checking role for user:', user?.email, user?.id);
      
      if (!user) {
        console.log('useUserRole: No user found, setting roles to false');
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      try {
        console.log('useUserRole: Fetching roles from database for user ID:', user.id);
        
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('useUserRole: Error fetching user roles:', error);
          setIsAdmin(false);
          setIsModerator(false);
          setLoading(false);
          return;
        }

        console.log('useUserRole: Raw roles data:', roles);
        const userRoles = roles?.map(r => r.role) || [];
        console.log('useUserRole: Processed user roles:', userRoles);
        
        const adminStatus = userRoles.includes('admin');
        const moderatorStatus = userRoles.includes('moderator');
        
        console.log('useUserRole: Setting isAdmin to:', adminStatus);
        console.log('useUserRole: Setting isModerator to:', moderatorStatus);
        
        setIsAdmin(adminStatus);
        setIsModerator(moderatorStatus);
      } catch (error) {
        console.error('useUserRole: Exception checking user role:', error);
        setIsAdmin(false);
        setIsModerator(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user?.id]); // Depend on user.id specifically

  console.log('useUserRole: Current state - isAdmin:', isAdmin, 'isModerator:', isModerator, 'loading:', loading);

  return { isAdmin, isModerator, loading };
};
