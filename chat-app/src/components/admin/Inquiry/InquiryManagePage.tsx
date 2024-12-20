import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, Mail, Phone, Building, MapPin, Clock, Info, User, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ContactInquiry {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  company_name: string;
  country: string;
  job_title: string;
  job_details: string;
  company_location: string;
  interested_product: string;
  current_solution: string;
  inquiry_reason: string;
  submission_date: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
}

const CustomerInquiryPage = () => {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const url = selectedStatus !== 'all' 
        ? `http://127.0.0.1:5000/api/contacts?status=${selectedStatus}`
        : 'http://127.0.0.1:5000/api/contacts';
      
      const response = await fetch(url, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/contacts/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      await fetchInquiries();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => 
    inquiry.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inquiry.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <HelpCircle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const showDetails = (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#213555' }} />
      </div>
    );
  }

  return (
    <div className="p-6" style={{ backgroundColor: '#F5EFE7', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold" style={{ color: '#213555' }}>Customer Inquiries</h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={{ borderColor: '#D8C4B6', backgroundColor: 'white' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Inquiries List */}
        <div className="grid gap-4">
          {filteredInquiries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No inquiries found matching your criteria
            </div>
          ) : (
            filteredInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border"
                style={{ borderColor: '#D8C4B6' }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold" style={{ color: '#213555' }}>{inquiry.full_name}</h3>
                      <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)}
                        <span className="capitalize">{inquiry.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <Mail className="w-4 h-4" />
                        <span>{inquiry.email}</span>
                      </div>
                      {inquiry.phone_number && (
                        <div className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                          <Phone className="w-4 h-4" />
                          <span>{inquiry.phone_number}</span>
                        </div>
                      )}
                      {inquiry.company_name && (
                        <div className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                          <Building className="w-4 h-4" />
                          <span>{inquiry.company_name}</span>
                        </div>
                      )}
                      {inquiry.company_location && (
                        <div className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                          <MapPin className="w-4 h-4" />
                          <span>{inquiry.company_location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {inquiry.status !== 'resolved' && inquiry.status !== 'rejected' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id, 'resolved')}
                          className="px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-green-600 hover:bg-green-700"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(inquiry.id, 'rejected')}
                          className="px-4 py-2 rounded-lg text-white transition-colors duration-200 bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => showDetails(inquiry)}
                      className="px-4 py-2 rounded-lg transition-colors duration-200"
                      style={{ backgroundColor: '#213555', color: 'white' }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold" style={{ color: '#213555' }}>
                Inquiry Details
              </DialogTitle>
              <DialogDescription>
                Submitted on {selectedInquiry && new Date(selectedInquiry.submission_date).toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            {selectedInquiry && (
              <div className="mt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg" style={{ color: '#213555' }}>Contact Information</h4>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <User className="w-4 h-4" />
                        <span className="font-medium">Name:</span> {selectedInquiry.full_name}
                      </p>
                      <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email:</span> {selectedInquiry.email}
                      </p>
                      {selectedInquiry.phone_number && (
                        <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">Phone:</span> {selectedInquiry.phone_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-lg" style={{ color: '#213555' }}>Company Information</h4>
                    <div className="space-y-2">
                      <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <Building className="w-4 h-4" />
                        <span className="font-medium">Company:</span> {selectedInquiry.company_name}
                      </p>
                      <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <MapPin className="w-4 h-4" />
                        <span className="font-medium">Location:</span> {selectedInquiry.company_location}
                      </p>
                      <p className="flex items-center gap-2" style={{ color: '#3E5879' }}>
                        <User className="w-4 h-4" />
                        <span className="font-medium">Job Title:</span> {selectedInquiry.job_title}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-lg" style={{ color: '#213555' }}>Inquiry Details</h4>
                  <div className="space-y-4" style={{ color: '#3E5879' }}>
                    <div>
                      <p className="font-medium mb-1">Interested Product</p>
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedInquiry.interested_product}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Current Solution</p>
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedInquiry.current_solution}</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Reason for Inquiry</p>
                      <p className="bg-gray-50 p-3 rounded-lg">{selectedInquiry.inquiry_reason}</p>
                    </div>
                    {selectedInquiry.job_details && (
                      <div>
                        <p className="font-medium mb-1">Additional Details</p>
                        <p className="bg-gray-50 p-3 rounded-lg">{selectedInquiry.job_details}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CustomerInquiryPage;