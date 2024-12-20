import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const getUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

interface Article {
  id: number;
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  author_id: number;
  author_name: string;
  published_date: string;
}

const ArticlesManagePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    image_url: '',
    author_id: getUser()?.id || null
  });

  const fetchArticles = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/articles', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingArticle 
        ? `http://127.0.0.1:5000/api/articles/${editingArticle.id}`
        : 'http://127.0.0.1:5000/api/articles';
        
      const response = await fetch(url, {
        method: editingArticle ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save article');
      
      await fetchArticles();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/articles/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete article');
      await fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      image_url: '',
      author_id: getUser()?.id || null
    });
    setEditingArticle(null);
    setIsDialogOpen(false);
  };

  const startEditing = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category || '',
      image_url: article.image_url || '',
      author_id: article.author_id
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const categories = ['all', ...new Set(articles.map(article => article.category || 'Uncategorized'))];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Manage Articles</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-[#213555] hover:bg-[#3E5879]"
            >
              <Plus className="w-4 h-4" />
              New Article
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Article Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
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
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 h-64 font-mono text-sm"
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
                    {editingArticle ? 'Update' : 'Create'} Article
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Articles List */}
        <div className="grid gap-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No articles found matching your criteria
            </div>
          ) : (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#213555' }}>{article.title}</h3>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Category:</span> {article.category || 'Uncategorized'}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Author:</span> {article.author_name}
                      </p>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Published:</span> {new Date(article.published_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(article)}
                      className="p-2 rounded-lg transition-colors duration-200"
                      style={{ color: '#3E5879' }}
                      title="Edit article"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 rounded-lg transition-colors duration-200 text-red-600"
                      title="Delete article"
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

export default ArticlesManagePage;