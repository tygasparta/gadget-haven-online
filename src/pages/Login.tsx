
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Smartphone, Shield, ArrowLeft, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuthContext();

  const checkUserRole = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return false;
      }

      const userRoles = roles?.map(r => r.role) || [];
      return userRoles.includes('admin');
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        toast({ 
          title: "Error", 
          description: error.message, 
          variant: "destructive" 
        });
        return;
      }

      if (data.user) {
        // Check if user is admin
        const isAdmin = await checkUserRole(data.user.id);
        
        if (isAdmin) {
          toast({ title: "Welcome back!", description: "Logged in as Administrator" });
          navigate('/admin');
        } else {
          toast({ title: "Welcome back!", description: "Successfully logged in" });
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "An error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back to Store Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <Store className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Store</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to your Gadget Genie account</p>
        </div>

        {/* Login Form */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-blue-200">
                <input type="checkbox" className="rounded border-white/20" />
                <span>Remember me</span>
              </label>
              <Link to="#" className="text-sm text-blue-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg p-4">
              <p className="text-sm text-blue-100 mb-2 font-medium flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Demo Credentials:
              </p>
              <p className="text-xs text-blue-200">Admin: info@gadgetgenie.org / any password</p>
              <p className="text-xs text-blue-200">User: any email / any password</p>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 group shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-4">
            <Link to="/signup" className="text-blue-200 hover:text-white transition-colors">
              Don't have an account? <span className="font-semibold">Sign up</span>
            </Link>
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-300">
              <Shield className="w-4 h-4" />
              <span>Secured by industry-standard encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
