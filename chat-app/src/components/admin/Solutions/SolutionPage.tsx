import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, Check, Search, Building2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Solution {
  id: number;
  customer_id: number;
  customer_name: string;
  title: string;
  description: string;
  industry: string;
  key_features: string;
  image_url?: string;
  created_at: string;
}

const ManageSolutionsPage = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const [formData, setFormData] = useState({
    customer_id: '',
    title: '',
    description: '',
    industry: '',
    key_features: '',
    image_url: ''
  });

  const fetchSolutions = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/solutions', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch solutions');
      const data = await response.json();
      setSolutions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch solutions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSolutions();
  }, [fetchSolutions]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingSolution 
        ? `http://127.0.0.1:5000/api/solutions/${editingSolution.id}`
        : 'http://127.0.0.1:5000/api/solutions';
        
      const response = await fetch(url, {
        method: editingSolution ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save solution');
      
      await fetchSolutions();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save solution');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this solution?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/solutions/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete solution');
      await fetchSolutions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete solution');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      title: '',
      description: '',
      industry: '',
      key_features: '',
      image_url: ''
    });
    setEditingSolution(null);
    setIsDialogOpen(false);
  };

  const startEditing = (solution: Solution) => {
    setEditingSolution(solution);
    setFormData({
      customer_id: solution.customer_id.toString(),
      title: solution.title,
      description: solution.description,
      industry: solution.industry,
      key_features: solution.key_features,
      image_url: solution.image_url || ''
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const industries = ['all', ...new Set(solutions.map(solution => solution.industry))];

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = 
      solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solution.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || solution.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
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
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Manage Solutions</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search solutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              {industries.map(industry => (
                <option key={industry} value={industry}>
                  {industry === 'all' ? 'All Industries' : industry}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-[#213555] hover:bg-[#3E5879]"
            >
              <Plus className="w-4 h-4" />
              New Solution
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Solution Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                {editingSolution ? 'Edit Solution' : 'Create New Solution'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>
                    Customer ID
                  </label>
                  <input
                    type="number"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>
                    Key Features
                  </label>
                  <textarea
                    value={formData.key_features}
                    onChange={(e) => setFormData({ ...formData, key_features: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 h-32"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                    placeholder="Enter key features separated by commas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 h-32"
                    style={{ borderColor: '#D8C4B6' }}
                    required
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
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {editingSolution ? 'Update' : 'Create'} Solution
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Solutions List */}
        <div className="grid gap-4">
          {filteredSolutions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No solutions found matching your criteria
            </div>
          ) : (
            filteredSolutions.map((solution) => (
              <div
                key={solution.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#213555' }}>{solution.title}</h3>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Customer:</span> {solution.customer_name}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Industry:</span> {solution.industry}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Created:</span> {new Date(solution.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Key Features:</span><br />
                        {solution.key_features}
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#3E5879' }}>
                        {solution.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(solution)}
                      className="p-2 rounded-lg transition-colors duration-200"
                      style={{ color: '#3E5879' }}
                      title="Edit solution"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(solution.id)}
                      className="p-2 rounded-lg transition-colors duration-200 text-red-600"
                      title="Delete solution"
                    >
                      <Trash2 className="w-5 h-5" />
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

export default ManageSolutionsPage;