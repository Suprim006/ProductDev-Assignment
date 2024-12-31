import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, Check, Search, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Feedback {
  id: number;
  customer_id: number;
  customer_name: string;
  feedback_text: string;
  rating: number;
  feedback_date: string;
}

const FeedbackManagePage = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<string>('all');

  const [formData, setFormData] = useState({
    customer_id: '',
    feedback_text: '',
    rating: ''
  });

  const fetchFeedbacks = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/feedbacks', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      const data = await response.json();
      setFeedbacks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingFeedback 
        ? `http://127.0.0.1:5000/api/feedbacks/${editingFeedback.id}`
        : 'http://127.0.0.1:5000/api/feedbacks';
        
      const response = await fetch(url, {
        method: editingFeedback ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save feedback');
      
      await fetchFeedbacks();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/feedbacks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete feedback');
      await fetchFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete feedback');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      feedback_text: '',
      rating: ''
    });
    setEditingFeedback(null);
    setIsDialogOpen(false);
  };

  const startEditing = (feedback: Feedback) => {
    setEditingFeedback(feedback);
    setFormData({
      customer_id: feedback.customer_id.toString(),
      feedback_text: feedback.feedback_text,
      rating: feedback.rating.toString()
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const ratings = ['all', '1', '2', '3', '4', '5'];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.feedback_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = selectedRating === 'all' || feedback.rating.toString() === selectedRating;
    return matchesSearch && matchesRating;
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Manage Feedback</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              {ratings.map(rating => (
                <option key={rating} value={rating}>
                  {rating === 'all' ? 'All Ratings' : `${rating} Stars`}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-[#213555] hover:bg-[#3E5879]"
            >
              <Plus className="w-4 h-4" />
              New Feedback
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Feedback Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                {editingFeedback ? 'Edit Feedback' : 'Create New Feedback'}
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
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Rating</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  >
                    <option value="">Select Rating</option>
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} Stars</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>
                    Feedback Text
                  </label>
                  <textarea
                    value={formData.feedback_text}
                    onChange={(e) => setFormData({ ...formData, feedback_text: e.target.value })}
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
                    {editingFeedback ? 'Update' : 'Create'} Feedback
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Feedbacks List */}
        <div className="grid gap-4">
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No feedbacks found matching your criteria
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-semibold" style={{ color: '#213555' }}>
                        {feedback.customer_name}
                      </h3>
                      <div className="flex">{renderStars(feedback.rating)}</div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Date:</span> {new Date(feedback.feedback_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#3E5879' }}>
                        {feedback.feedback_text}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(feedback)}
                      className="p-2 rounded-lg transition-colors duration-200"
                      style={{ color: '#3E5879' }}
                      title="Edit feedback"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(feedback.id)}
                      className="p-2 rounded-lg transition-colors duration-200 text-red-600"
                      title="Delete feedback"
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

export default FeedbackManagePage;