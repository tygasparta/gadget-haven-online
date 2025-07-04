
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
  last_sign_in_at?: string | null;
  email_confirmed_at?: string | null;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching all users from profiles and auth...');
      
      // First get all profiles
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

      // Try to get additional user metadata from auth.users (admin only)
      let authUsers = [];
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (!authError && authData?.users) {
          authUsers = authData.users;
          console.log('Fetched auth users:', authUsers.length);
        }
      } catch (error) {
        console.log('Could not fetch auth users (expected if not admin):', error);
      }

      // Combine profiles with roles and auth data
      const usersWithRoles = profiles?.map(profile => {
        const roles = userRoles?.filter(role => role.user_id === profile.id).map(role => role.role) || [];
        const authUser = authUsers.find(u => u.id === profile.id);
        
        return {
          ...profile,
          roles,
          last_sign_in_at: authUser?.last_sign_in_at || null,
          email_confirmed_at: authUser?.email_confirmed_at || null,
        };
      }) || [];

      console.log('Final users with roles:', usersWithRoles);
      return usersWithRoles as User[];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
