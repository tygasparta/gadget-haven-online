
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Eye, Shield, UserX, UserCheck, Mail, Calendar, MoreHorizontal, Crown, Users as UsersIcon, Activity, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
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

  const handleToggleUserRole = async (userId: string, currentRoles: string[]) => {
    const isAdmin = currentRoles.includes('admin');
    try {
      if (isAdmin) {
        const { error } = await supabase.from('user_roles').delete().eq('user_id', userId).eq('role', 'admin');
        if (error) throw error;
        toast({ title: "Role updated", description: "Admin privileges removed successfully" });
      } else {
        const { error } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
        if (error) throw error;
        toast({ title: "Role updated", description: "Admin privileges granted successfully" });
      }
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast({ title: "Error updating role", description: error.message, variant: "destructive" });
    }
    setShowRoleDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserInitials = (user: any) => {
    if (user.full_name) return user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (user: any) => {
    const isRecent = user.created_at && new Date(user.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return isRecent
      ? <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs"><Activity className="w-3 h-3 mr-1" />Recent</Badge>
      : <Badge variant="secondary" className="bg-accent text-primary text-xs"><UserCheck className="w-3 h-3 mr-1" />Active</Badge>;
  };

  const adminCount = users.filter(u => u.roles?.includes('admin')).length;
  const recentCount = users.filter(u => u.created_at && new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
  const completeCount = users.filter(u => u.full_name).length;

  const statCards = [
    { label: 'Total Users', value: users.length, icon: UsersIcon, iconBg: 'bg-accent text-primary' },
    { label: 'Administrators', value: adminCount, icon: Crown, iconBg: 'bg-violet-50 text-violet-600' },
    { label: 'Recent (7 days)', value: recentCount, icon: Clock, iconBg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Complete Profiles', value: completeCount, icon: UserCheck, iconBg: 'bg-amber-50 text-amber-600' },
  ];

  if (isLoading) {
    return (
      <Card className="border">
        <CardContent className="p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border">
        <CardContent className="p-8 text-center">
          <UserX className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Users</h3>
          <p className="text-muted-foreground mb-4">Failed to fetch user data.</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })} variant="destructive">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent">
                <UsersIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">User Management</h3>
                <p className="text-muted-foreground text-sm">{filteredUsers.length} of {users.length} users • {adminCount} admins</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 w-80" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statCards.map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={i} className="border">
                  <CardContent className="p-4 text-center">
                    <div className={`w-10 h-10 ${s.iconBg} rounded-xl mx-auto mb-3 flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                            {getUserInitials(user)}
                          </div>
                          {user.roles?.includes('admin') && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                              <Crown className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{user.full_name || 'No name provided'}</p>
                          <p className="text-xs text-muted-foreground">ID: {user.id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={user.roles?.includes('admin') ? 'bg-violet-100 text-violet-700 text-xs' : 'bg-accent text-primary text-xs'}>
                        {user.roles?.includes('admin') ? <><Crown className="w-3 h-3 mr-1" />Admin</> : <><UserCheck className="w-3 h-3 mr-1" />User</>}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowViewDialog(true); }}>
                            <Eye className="w-4 h-4 mr-2" />View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowRoleDialog(true); }}>
                            <Shield className="w-4 h-4 mr-2" />{user.roles?.includes('admin') ? 'Remove Admin' : 'Grant Admin'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserX className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Users Found</h3>
                <p className="text-sm text-muted-foreground">{searchTerm ? `No users match "${searchTerm}"` : 'No users available'}</p>
                {searchTerm && <Button onClick={() => setSearchTerm('')} variant="outline" className="mt-4">Clear Search</Button>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <AlertDialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-primary" />User Profile</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-6">
                {selectedUser && (
                  <>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">{getUserInitials(selectedUser)}</div>
                        {selectedUser.roles?.includes('admin') && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center"><Crown className="w-3 h-3 text-white" /></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{selectedUser.full_name || 'Unnamed User'}</h3>
                        <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                        <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><label className="text-xs font-medium text-muted-foreground">User ID</label><p className="text-foreground font-mono text-xs bg-muted p-2 rounded mt-1">{selectedUser.id}</p></div>
                      <div><label className="text-xs font-medium text-muted-foreground">Phone</label><p className="text-foreground mt-1">{selectedUser.phone || 'Not provided'}</p></div>
                      <div><label className="text-xs font-medium text-muted-foreground">Joined</label><p className="text-foreground mt-1">{formatDate(selectedUser.created_at)}</p></div>
                      <div><label className="text-xs font-medium text-muted-foreground">Role</label><div className="mt-1"><Badge variant="secondary" className={selectedUser.roles?.includes('admin') ? 'bg-violet-100 text-violet-700' : 'bg-accent text-primary'}>{selectedUser.roles?.includes('admin') ? 'Administrator' : 'Standard User'}</Badge></div></div>
                    </div>
                  </>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Close</AlertDialogCancel></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role Change Dialog */}
      <AlertDialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-violet-600" />Change User Role</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              {selectedUser && (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
                    <p>Are you sure you want to {selectedUser.roles?.includes('admin') ? 'remove admin privileges from' : 'grant admin privileges to'} <strong className="text-foreground">{selectedUser.full_name || selectedUser.email}</strong>?</p>
                  </div>
                  <div className="text-sm">
                    {selectedUser.roles?.includes('admin') ? (
                      <div><p className="text-destructive font-medium">⚠️ This will remove access to:</p><ul className="list-disc list-inside ml-4 text-muted-foreground mt-1 space-y-1"><li>Admin dashboard</li><li>User management</li><li>Product & order management</li><li>Analytics & settings</li></ul></div>
                    ) : (
                      <div><p className="text-emerald-600 font-medium">✅ This will grant access to:</p><ul className="list-disc list-inside ml-4 text-muted-foreground mt-1 space-y-1"><li>Full admin dashboard</li><li>User management</li><li>Product & order management</li><li>Analytics & settings</li></ul></div>
                    )}
                  </div>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedUser && handleToggleUserRole(selectedUser.id, selectedUser.roles || [])} className={selectedUser?.roles?.includes('admin') ? 'bg-destructive hover:bg-destructive/90' : ''}>
              {selectedUser?.roles?.includes('admin') ? 'Remove Admin Role' : 'Grant Admin Role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UsersTab;
