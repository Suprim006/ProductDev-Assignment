import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Event {
  id: number;
  event_name: string;
  event_description: string;
  event_start_date: string;
  event_end_date: string;
  location: string;
  is_upcoming: boolean;
}

const imageList = [
  "/images/articles/pexels-cottonbro-6153345.jpg",
  "/images/articles/pexels-googledeepmind-17483868.jpg",
  "/images/articles/pexels-kindelmedia-8566445.jpg",

  "/images/articles/pexels-pavel-danilyuk-8439089.jpg",
  "/images/articles/pexels-sanketgraphy-16587314.jpg",
  "/images/articles/pexels-santesson89-17325393.jpg",

  "/images/articles/pexels-shvetsa-5614108.jpg",
  "/images/articles/pexels-tara-winstead-8849277.jpg",
  "/images/articles/pexels-zamanisahudi-101764.jpg"
];

// Function to get a random image
const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageList.length);
  return imageList[randomIndex];
};

const EventsPage = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpcomingOnly, setShowUpcomingOnly] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch events with optional filtering
        const response = await axios.get(
          `http://127.0.0.1:5000/api/events${showUpcomingOnly ? '?filter=true' : ''}`
        );
        setEvents(response.data);
        setFilteredEvents(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch events');
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [showUpcomingOnly]);

  // Function to truncate text
  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startFormat = start.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const endFormat = end.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `${startFormat} - ${endFormat}`;
  };

  // Toggle between all events and upcoming events
  const toggleEventFilter = () => {
    setShowUpcomingOnly(!showUpcomingOnly);
  };

  const handleLearnMore = (eventId: number) => {
    router.push(`/events/${eventId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-[#213555]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#213555] text-center">
          Our Events
        </h1>
        <button 
          onClick={toggleEventFilter}
          className="
            bg-[#213555] text-white 
            px-4 py-2 rounded-lg 
            hover:bg-[#3E5879] 
            transition duration-300
          "
        >
          {showUpcomingOnly ? 'Show All Events' : 'Show Upcoming Events'}
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No events found.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className="flex bg-white shadow-md rounded-lg overflow-hidden border border-[#D8C4B6]"
            >
              {/* Placeholder Image - Replace with actual image logic */}
              <div className="w-1/3 bg-[#3E5879] flex items-center justify-center">
                <img 
                  src={getRandomImage()} 
                  alt={event.event_name} 
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Event Content */}
              <div className="w-2/3 p-6">
                {/* Date and Location */}
                <div className="flex justify-between items-center mb-4 text-[#213555]">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span className="text-sm">
                      {formatDateRange(event.event_start_date, event.event_end_date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                {/* Event Name */}
                <h2 className="text-2xl font-semibold text-[#213555] mb-3">
                  {event.event_name}
                </h2>

                {/* Description */}
                <p className="text-gray-700 mb-4">
                  {truncateText(event.event_description)}
                </p>

                {/* Event Status Badge */}
                {event.is_upcoming && (
                  <span className="
                    inline-block 
                    bg-green-100 
                    text-green-800 
                    text-xs 
                    px-2 
                    py-1 
                    rounded-full 
                    mb-4
                  ">
                    Upcoming Event
                  </span>
                )}

                {/* Learn More Button */}
                <button 
                  onClick={() => handleLearnMore(event.id)}
                  className="
                    bg-[#213555] text-white 
                    px-4 py-2 rounded-lg 
                    hover:bg-[#3E5879] 
                    transition duration-300
                  "
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;