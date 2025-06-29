
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
      if (!user) {
        setIsAdmin(false);
        setIsModerator(false);
        setLoading(false);
        return;
      }

      try {
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user roles:', error);
          setLoading(false);
          return;
        }

        const userRoles = roles?.map(r => r.role) || [];
        setIsAdmin(userRoles.includes('admin'));
        setIsModerator(userRoles.includes('moderator'));
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserRole();
  }, [user]);

  return { isAdmin, isModerator, loading };
};
