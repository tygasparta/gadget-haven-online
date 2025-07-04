
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Shield, UserX, UserCheck, Mail, Calendar, MoreHorizontal, Crown, Users as UsersIcon, Activity, Clock } from 'lucide-react';
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
  const { data: users = [], isLoading, error } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);

  console.log('UsersTab: Users data:', users);
  console.log('UsersTab: Loading state:', isLoading);
  console.log('UsersTab: Error:', error);

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
          description: "Admin privileges removed successfully",
          className: "bg-green-600 text-white"
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'admin' });
          
        if (error) throw error;
        
        toast({
          title: "Role updated",
          description: "Admin privileges granted successfully",
          className: "bg-green-600 text-white"
        });
      }

      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      console.error('Error updating role:', error);
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
    console.log('Viewing user:', user);
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
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (user: any) => {
    const isEmailConfirmed = !!user.email_confirmed_at;
    const hasRecentActivity = user.last_sign_in_at && 
      new Date(user.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    if (!isEmailConfirmed) {
      return (
        <Badge className="bg-yellow-600 text-white animate-pulse">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    }

    if (hasRecentActivity) {
      return (
        <Badge className="bg-green-600 text-white">
          <Activity className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-600 text-white">
        <UserCheck className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
              <UsersIcon className="w-6 h-6 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Loading Users</h3>
              <p className="text-gray-300">Fetching user data from database...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <UserX className="w-16 h-16 text-red-400 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold mb-2 text-red-400">Error Loading Users</h3>
              <p className="text-gray-300">Failed to fetch user data. Please try again.</p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white animate-fade-in">
        <CardContent className="p-6">
          {/* Enhanced Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    User Management
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {filteredUsers.length} of {users.length} users • {users.filter(u => u.roles?.includes('admin')).length} admins
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-80 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <UsersIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-blue-300 text-sm">Total Users</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{users.filter(u => u.roles?.includes('admin')).length}</p>
                <p className="text-purple-300 text-sm">Admins</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500/20 to-green-600/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {users.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-green-300 text-sm">Active (7d)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{users.filter(u => !u.email_confirmed_at).length}</p>
                <p className="text-yellow-300 text-sm">Pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Table */}
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 bg-white/5">
                  <TableHead className="text-gray-300 font-semibold">User</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Contact</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Activity</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Role</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user.id} 
                    className="border-white/10 hover:bg-white/5 transition-all duration-300 group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                            {getUserInitials(user)}
                          </div>
                          {user.roles?.includes('admin') && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <Crown className="w-2 h-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {user.full_name || 'No name provided'}
                          </p>
                          <p className="text-sm text-gray-400">
                            ID: {user.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-400 text-xs">📱</span>
                            <span className="text-gray-400 text-xs">{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">
                            Joined {formatDate(user.created_at)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Last seen: {formatDate(user.last_sign_in_at)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          user.roles?.includes('admin') 
                            ? 'bg-purple-600 text-white border-purple-500' 
                            : 'bg-blue-600 text-white border-blue-500'
                        } transition-all duration-300 hover:scale-105`}
                      >
                        {user.roles?.includes('admin') ? (
                          <>
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            User
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuLabel className="text-gray-200">User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem 
                            onClick={() => handleViewUser(user)}
                            className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleDialog(true);
                            }}
                            className="text-gray-200 hover:bg-gray-700 focus:bg-gray-700"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            {user.roles?.includes('admin') ? 'Remove Admin' : 'Grant Admin'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <UserX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Users Found</h3>
                <p className="text-gray-400">
                  {searchTerm ? `No users match "${searchTerm}"` : 'No users available'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                    className="mt-4 bg-white/10 text-white border-white/20 hover:bg-white/20"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced View User Dialog */}
      <AlertDialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-3">
              <Eye className="w-6 h-6 text-blue-400" />
              <span>User Profile Details</span>
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-6 text-gray-300">
                {selectedUser && (
                  <>
                    {/* User Header */}
                    <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/10">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                          {getUserInitials(selectedUser)}
                        </div>
                        {selectedUser.roles?.includes('admin') && (
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {selectedUser.full_name || 'Unnamed User'}
                        </h3>
                        <p className="text-gray-300">{selectedUser.email}</p>
                        <div className="mt-2">
                          {getStatusBadge(selectedUser)}
                        </div>
                      </div>
                    </div>
                    
                    {/* User Details Grid */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-400">User ID</label>
                          <p className="text-white font-mono text-sm bg-gray-700/50 p-2 rounded">{selectedUser.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Full Name</label>
                          <p className="text-white">{selectedUser.full_name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Email</label>
                          <p className="text-white">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Phone</label>
                          <p className="text-white">{selectedUser.phone || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-400">Role</label>
                          <div className="mt-1">
                            <Badge 
                              className={
                                selectedUser.roles?.includes('admin') 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-blue-600 text-white'
                              }
                            >
                              {selectedUser.roles?.includes('admin') ? 'Administrator' : 'Standard User'}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Account Created</label>
                          <p className="text-white">{formatDate(selectedUser.created_at)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Last Sign In</label>
                          <p className="text-white">{formatDate(selectedUser.last_sign_in_at)}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-400">Email Confirmed</label>
                          <p className="text-white">
                            {selectedUser.email_confirmed_at ? 'Yes' : 'Pending'}
                          </p>
                        </div>
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

      {/* Enhanced Role Change Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-purple-400" />
              <span>Change User Role</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 space-y-4">
              {selectedUser && (
                <>
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="font-medium">
                      Are you sure you want to {selectedUser.roles?.includes('admin') ? 'remove admin privileges from' : 'grant admin privileges to'} <strong className="text-white">{selectedUser.full_name || selectedUser.email}</strong>?
                    </p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {selectedUser.roles?.includes('admin') ? (
                      <div>
                        <p className="text-red-300">⚠️ This will remove their access to:</p>
                        <ul className="list-disc list-inside ml-4 text-gray-400">
                          <li>Admin dashboard and all administrative functions</li>
                          <li>User management capabilities</li>
                          <li>Product and order management</li>
                          <li>System analytics and settings</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <p className="text-green-300">✅ This will grant them access to:</p>
                        <ul className="list-disc list-inside ml-4 text-gray-400">
                          <li>Full admin dashboard access</li>
                          <li>User management capabilities</li>
                          <li>Product and order management</li>
                          <li>System analytics and settings</li>
                        </ul>
                      </div>
                    )}
                  </div>
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
              className={`${
                selectedUser?.roles?.includes('admin') 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-purple-600 hover:bg-purple-700'
              } transition-all duration-300`}
            >
              {selectedUser?.roles?.includes('admin') ? 'Remove Admin Role' : 'Grant Admin Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTab;
