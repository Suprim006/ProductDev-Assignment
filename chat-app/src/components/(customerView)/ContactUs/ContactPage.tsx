import React, { useState } from 'react';
import axios from 'axios';
import { 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Briefcase, 
  Globe, 
  MessageSquare 
} from 'lucide-react';

interface ContactFormData {
  full_name: string;
  email: string;
  phone_number?: string;
  company_name?: string;
  country?: string;
  job_title?: string;
  job_details: string;
  company_location?: string;
  interested_product?: string;
  current_solution?: string;
  inquiry_reason?: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    full_name: '',
    email: '',
    job_details: '',
    phone_number: '',
    company_name: '',
    country: '',
    job_title: '',
    company_location: '',
    interested_product: '',
    current_solution: '',
    inquiry_reason: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean | null;
    message: string;
  }>({
    success: null,
    message: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: null, message: '' });

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/api/contacts', 
        formData
      );

      setSubmitStatus({
        success: true,
        message: 'Your inquiry has been submitted successfully!'
      });

      // Reset form after successful submission
      setFormData({
        full_name: '',
        email: '',
        job_details: '',
        phone_number: '',
        company_name: '',
        country: '',
        job_title: '',
        company_location: '',
        interested_product: '',
        current_solution: '',
        inquiry_reason: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Failed to submit inquiry. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        {/* Contact Information Section (1/3 width) */}
        <div 
          className="
            w-full md:w-1/3 
            bg-[#213555] 
            text-white 
            p-8 
            flex 
            flex-col 
            justify-center
          "
        >
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="mr-4" size={24} />
              <div>
                <p className="font-semibold">Email</p>
                <p>support@aisolution.com</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Phone className="mr-4" size={24} />
              <div>
                <p className="font-semibold">Support Phone</p>
                <p>+44 (0) 1234 567890</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <MapPin className="mr-4" size={24} />
              <div>
                <p className="font-semibold">Address</p>
                <p>Sunderland, UK</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-sm opacity-75">
            <p>We're here to help and answer any questions you might have.</p>
            <p className="mt-2">Feel free to reach out!</p>
          </div>
        </div>

        {/* Contact Form Section (2/3 width) */}
        <div className="w-full md:w-2/3 p-8">
          <h2 className="text-3xl font-bold text-[#213555] mb-6">
            Get in Touch
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="full_name" 
                  className="block text-[#3E5879] mb-2"
                >
                  Full Name *
                </label>
                <div className="flex items-center border rounded">
                  <User className="ml-3 text-[#3E5879]" size={20} />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 pl-2 outline-none"
                    placeholder="Your Full Name"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="email" 
                  className="block text-[#3E5879] mb-2"
                >
                  Email *
                </label>
                <div className="flex items-center border rounded">
                  <Mail className="ml-3 text-[#3E5879]" size={20} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 pl-2 outline-none"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Optional Company Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="company_name" 
                  className="block text-[#3E5879] mb-2"
                >
                  Company Name
                </label>
                <div className="flex items-center border rounded">
                  <Briefcase className="ml-3 text-[#3E5879]" size={20} />
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-2 outline-none"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="country" 
                  className="block text-[#3E5879] mb-2"
                >
                  Country
                </label>
                <div className="flex items-center border rounded">
                  <Globe className="ml-3 text-[#3E5879]" size={20} />
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-2 outline-none"
                    placeholder="Your Country"
                  />
                </div>
              </div>
            </div>

            <div>
                <label htmlFor="company_location" className="block text-[#3E5879] mb-2">
                  Company Location
                </label>
                <div className="flex items-center border rounded">
                  <MapPin className="ml-3 text-[#3E5879]" size={20} />
                  <input
                    type="text"
                    id="company_location"
                    name="company_location"
                    value={formData.company_location}
                    onChange={handleInputChange}
                    className="w-full p-2 pl-2 outline-none"
                    placeholder="Location"
                  />
                </div>
            </div>

            <div>
              <label 
                htmlFor="interested_product" 
                className="block text-[#3E5879] mb-2"
              >
                Interested Product
              </label>
              <div className="flex items-center border rounded">
                <Briefcase className="ml-3 text-[#3E5879]" size={20} />
                <input
                  type="text"
                  id="interested_product"
                  name="interested_product"
                  value={formData.interested_product}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-2 outline-none"
                  placeholder="Specify the product of interest"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="current_solution" 
                className="block text-[#3E5879] mb-2"
              >
                Current Solution
              </label>
              <div className="flex items-center border rounded">
                <Briefcase className="ml-3 text-[#3E5879]" size={20} />
                <input
                  type="text"
                  id="current_solution"
                  name="current_solution"
                  value={formData.current_solution}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-2 outline-none"
                  placeholder="Describe your current solution"
                />
              </div>
            </div>

            {/* Inquiry Details */}
            <div>
              <label 
                htmlFor="inquiry_reason" 
                className="block text-[#3E5879] mb-2"
              >
                Inquiry Details
              </label>
              <div className="flex items-start border rounded">
                <MessageSquare className="ml-3 mt-3 text-[#3E5879]" size={20} />
                <textarea
                  id="inquiry_reason"
                  name="inquiry_reason"
                  value={formData.inquiry_reason}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-2 pl-2 outline-none resize-none"
                  placeholder="Please provide details about your inquiry..."
                ></textarea>
              </div>
            </div>

            {/* Submit Button and Status */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  w-full 
                  bg-[#213555] 
                  text-white 
                  p-3 
                  rounded 
                  hover:bg-[#3E5879] 
                  transition 
                  duration-300
                  flex 
                  items-center 
                  justify-center
                "
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                  'Submit Inquiry'
                )}
              </button>

              {submitStatus.success !== null && (
                <div 
                  className={`
                    mt-4 
                    p-3 
                    rounded 
                    text-center
                    ${
                      submitStatus.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }
                  `}
                >
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;