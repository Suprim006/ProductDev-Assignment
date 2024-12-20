import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Trash2, X, Check, Search, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Event {
  id: number;
  event_name: string;
  event_description: string;
  event_start_date: string;
  event_end_date: string;
  location: string;
  image_url?: string;
  is_upcoming: boolean;
}

const EventsManagePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUpcoming, setFilterUpcoming] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_start_date: '',
    event_end_date: '',
    location: '',
    image_url: '',
    is_upcoming: true
  });

  const fetchEvents = useCallback(async () => {
    try {
      const url = filterUpcoming !== null 
        ? `http://127.0.0.1:5000/api/events?filter=${filterUpcoming}`
        : 'http://127.0.0.1:5000/api/events';
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [filterUpcoming]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingEvent 
        ? `http://127.0.0.1:5000/api/events/${editingEvent.id}`
        : 'http://127.0.0.1:5000/api/events';
        
      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save event');
      
      await fetchEvents();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
    }
  };

  const resetForm = () => {
    setFormData({
      event_name: '',
      event_description: '',
      event_start_date: '',
      event_end_date: '',
      location: '',
      image_url: '',
      is_upcoming: true
    });
    setEditingEvent(null);
    setIsDialogOpen(false);
  };

  const startEditing = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      event_name: event.event_name,
      event_description: event.event_description,
      event_start_date: event.event_start_date,
      event_end_date: event.event_end_date,
      location: event.location,
      image_url: event.image_url || '',
      is_upcoming: event.is_upcoming
    });
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredEvents = events.filter(event => 
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.event_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && !isDialogOpen) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F5EFE7', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Manage Events</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={filterUpcoming === null ? 'all' : filterUpcoming.toString()}
              onChange={(e) => setFilterUpcoming(e.target.value === 'all' ? null : e.target.value === 'true')}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              <option value="all">All Events</option>
              <option value="true">Upcoming Events</option>
              <option value="false">Past Events</option>
            </select>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-[#213555] hover:bg-[#3E5879]"
            >
              <Plus className="w-4 h-4" />
              New Event
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Event Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Event Name</label>
                  <input
                    type="text"
                    value={formData.event_name}
                    onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: '#D8C4B6' }}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Start Date</label>
                    <input
                      type="datetime-local"
                      value={formData.event_start_date}
                      onChange={(e) => setFormData({ ...formData, event_start_date: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: '#D8C4B6' }}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>End Date</label>
                    <input
                      type="datetime-local"
                      value={formData.event_end_date}
                      onChange={(e) => setFormData({ ...formData, event_end_date: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: '#D8C4B6' }}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#213555' }}>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                    Event Description
                  </label>
                  <textarea
                    value={formData.event_description}
                    onChange={(e) => setFormData({ ...formData, event_description: e.target.value })}
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
                    {editingEvent ? 'Update' : 'Create'} Event
                  </button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Events List */}
        <div className="grid gap-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found matching your criteria
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2" style={{ color: '#213555' }}>{event.event_name}</h3>
                    <div className="space-y-2">
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                      <div className="flex gap-4">
                        <p className="text-sm" style={{ color: '#3E5879' }}>
                          <span className="font-medium">Start:</span> {new Date(event.event_start_date).toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: '#3E5879' }}>
                          <span className="font-medium">End:</span> {new Date(event.event_end_date).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm" style={{ color: '#3E5879' }}>
                        <span className="font-medium">Status:</span>{' '}
                        <span className={event.is_upcoming ? 'text-green-600' : 'text-red-600'}>
                          {event.is_upcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </p>
                      <p className="text-sm mt-2" style={{ color: '#3E5879' }}>
                        {event.event_description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEditing(event)}
                      className="p-2 rounded-lg transition-colors duration-200"
                      style={{ color: '#3E5879' }}
                      title="Edit event"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-gray-100 transition-colors duration-200"
                      title="Delete event"
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

export default EventsManagePage;