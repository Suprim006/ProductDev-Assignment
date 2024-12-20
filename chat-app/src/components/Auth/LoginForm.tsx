'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Mail } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      if (response.user?.role === 'admin') {
        localStorage.setItem('user', JSON.stringify(response.user));
        router.push('/admin/dashboard');
      } else {
        setError('Unauthorized access');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE7]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#213555]">Admin Login</h2>
          <p className="mt-2 text-[#3E5879]">Please sign in to continue</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="email" className="text-sm font-medium text-[#3E5879]">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#D8C4B6]" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-[#D8C4B6] rounded-md focus:ring-2 focus:ring-[#213555] focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="text-sm font-medium text-[#3E5879]">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#D8C4B6]" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-[#D8C4B6] rounded-md focus:ring-2 focus:ring-[#213555] focus:border-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#213555] hover:bg-[#3E5879] text-white rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#213555] disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}