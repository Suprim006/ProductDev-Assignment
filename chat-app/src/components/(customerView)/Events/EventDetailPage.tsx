"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Event {
  id: number;
  event_name: string;
  event_description: string;
  event_start_date: string;
  event_end_date: string;
  location: string;
  image_url: string;
  is_upcoming: boolean;
}

const EventDetailPage = ({ eventId }: { eventId: string }) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/events/${eventId}`);
        setEvent(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return {
      startFormat: start.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      endFormat: end.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-[#213555]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Event not found'}
      </div>
    );
  }

  const { startFormat, endFormat } = formatDateRange(event.event_start_date, event.event_end_date);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-[#213555] mb-6 hover:text-[#3E5879] transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Events
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#D8C4B6]">
        <div className="relative h-[400px]">
          <img 
            src={event.image_url || "/images/articles/pexels-cottonbro-6153345.jpg"} 
            alt={event.event_name}
            className="w-full h-full object-cover"
          />
          {event.is_upcoming && (
            <div className="absolute top-4 right-4">
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                Upcoming Event
              </span>
            </div>
          )}
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-[#213555] mb-6">
            {event.event_name}
          </h1>

          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-8 text-[#213555]">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar size={20} />
              <span>
                {startFormat} - {endFormat}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={20} />
              <span>{event.location}</span>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700">
            {event.event_description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
