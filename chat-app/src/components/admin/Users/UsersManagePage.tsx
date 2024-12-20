import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, UserPlus, UserX, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersManagePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/users', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingUser 
        ? `http://127.0.0.1:5000/api/users/${editingUser.id}`
        : 'http://127.0.0.1:5000/api/users';
        
      const response = await fetch(url, {
        method: editingUser ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save user');
      
      await fetchUsers();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: 'user',
      password: ''
    });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Don't populate password when editing
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const roles = ['all', ...new Set(users.map(user => user.role))];

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading && !isDialogOpen) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#213555' }} />
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F5EFE7', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Manage Users</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-[#213555] hover:bg-[#3E5879]"
            >
              <UserPlus className="w-4 h-4" />
              New User
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* User Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                {editingUser ? 'Edit User' : 'Create New User'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>
                    {editingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required={!editingUser}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded-lg transition-colors duration-200"
                    style={{ borderColor: '#213555', color: '#213555' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200"
                    style={{ backgroundColor: '#213555' }}
                    disabled={loading}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                    {editingUser ? 'Update' : 'Create'} User
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Users List */}
        <div className="grid gap-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found matching your criteria
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#213555' }}>{user.username}</h3>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Role:</span> {user.role}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(user)}
                      className="p-2 rounded-lg transition-colors duration-200"
                      style={{ color: '#3E5879' }}
                      title="Edit user"
                    >
                      <Shield className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 rounded-lg transition-colors duration-200 text-red-600"
                      title="Delete user"
                    >
                      <UserX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersManagePage;