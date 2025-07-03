
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Shield, UserX, UserCheck, Mail, Calendar, MoreHorizontal } from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUsers } from '@/hooks/useUsers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const UsersTab = () => {
  const { data: users = [], isLoading } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  const handleToggleUserRole = async (userId: string, currentRoles: string[]) => {
    const isAdmin = currentRoles.includes('admin');
    
    try {
      if (isAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'admin');
        
        if (error) throw error;
        
        toast({
          title: "Role updated",
          description: "Admin privileges removed successfully"
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
          
        if (error) throw error;
        
        toast({
          title: "Role updated",
          description: "Admin privileges granted successfully"
        });
      }

      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive"
      });
    }
    
    setShowRoleDialog(false);
    setSelectedUser(null);
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserInitials = (user: any) => {
    if (user.full_name) {
      return user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return user.email?.[0].toUpperCase() || 'U';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-300">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold">User Management</h3>
              <p className="text-gray-400 text-sm mt-1">
                {filteredUsers.length} of {users.length} users
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">User</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {getUserInitials(user)}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.full_name || 'No name'}
                          </p>
                          <p className="text-sm text-gray-400">
                            ID: {user.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          user.roles?.includes('admin') 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-blue-600 text-white'
                        }
                      >
                        {user.roles?.includes('admin') ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600 text-white">
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuLabel className="text-gray-200">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem 
                            onClick={() => handleViewUser(user)}
                            className="text-gray-200 hover:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleDialog(true);
                            }}
                            className="text-gray-200 hover:bg-gray-700"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {user.roles?.includes('admin') ? 'Remove Admin' : 'Make Admin'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">No users found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <AlertDialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>User Details</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 text-gray-300">
                {selectedUser && (
                  <>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {getUserInitials(selectedUser)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {selectedUser.full_name || 'No name provided'}
                        </h3>
                        <p className="text-gray-400">{selectedUser.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                      <div>
                        <label className="text-sm font-medium text-gray-400">User ID</label>
                        <p className="text-white">{selectedUser.id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Role</label>
                        <Badge 
                          className={
                            selectedUser.roles?.includes('admin') 
                              ? 'bg-purple-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }
                        >
                          {selectedUser.roles?.includes('admin') ? 'Admin' : 'User'}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Phone</label>
                        <p className="text-white">{selectedUser.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400">Member Since</label>
                        <p className="text-white">{formatDate(selectedUser.created_at)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Change User Role</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              {selectedUser && (
                <>
                  Are you sure you want to {selectedUser.roles?.includes('admin') ? 'remove admin privileges from' : 'grant admin privileges to'} <strong>{selectedUser.full_name || selectedUser.email}</strong>?
                  <br /><br />
                  {selectedUser.roles?.includes('admin') 
                    ? 'This will remove their access to the admin dashboard and all administrative functions.'
                    : 'This will grant them full access to the admin dashboard and all administrative functions.'
                  }
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedUser && handleToggleUserRole(selectedUser.id, selectedUser.roles || [])}
              className={selectedUser?.roles?.includes('admin') ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'}
            >
              {selectedUser?.roles?.includes('admin') ? 'Remove Admin' : 'Make Admin'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTab;
