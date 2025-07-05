
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at: string | null;
  updated_at: string | null;
  roles?: string[];
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching all users from profiles...');
      
      // Get all profiles (this will show all registered users)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('Fetched profiles:', profiles);

      // Get user roles for all users
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) {
        console.error('Error fetching user roles:', rolesError);
        // Don't throw error, just log it and continue with empty roles
      }

      console.log('Fetched user roles:', userRoles);

      // Combine profiles with roles
      const usersWithRoles = profiles?.map(profile => {
        const roles = userRoles?.filter(role => role.user_id === profile.id).map(role => role.role) || [];
        
        return {
          ...profile,
          roles,
        };
      }) || [];

      console.log('Final users with roles:', usersWithRoles);
      return usersWithRoles as User[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
