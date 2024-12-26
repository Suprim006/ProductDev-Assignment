import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Star, 
  CheckCircle, 
  Target, 
  Quote 
} from 'lucide-react';

interface Solution {
  id: number;
  customer_id: number;
  customer_name: string;
  title: string;
  description: string;
  industry: string;
  key_features: string;
  image_url: string | null;
}

interface Feedback {
  id: number;
  customer_id: number;
  customer_name: string;
  feedback_text: string;
  rating: number;
  feedback_date: string;
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


const PortfolioPage = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [solutionsResponse, feedbacksResponse] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/solutions'),
          axios.get('http://127.0.0.1:5000/api/feedbacks')
        ]);

        setSolutions(solutionsResponse.data);
        setFeedbacks(feedbacksResponse.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch portfolio data');
        setIsLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star 
            key={index} 
            size={20} 
            className={
              index < rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      {/* Past Solutions Section */}
      <section className="mb-12">
        <div className="flex items-center mb-8">
          <Briefcase className="text-[#213555] mr-4" size={32} />
          <h2 className="text-3xl font-bold text-[#213555]">
            Our Past Solutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((solution) => (
            <div 
              key={solution.id} 
              className="
                bg-white 
                rounded-lg 
                shadow-md 
                border 
                border-[#D8C4B6] 
                overflow-hidden 
                transition 
                hover:shadow-lg
              "
            >
              {/* Solution Image */}
              <div className="h-48 bg-[#3E5879] flex items-center justify-center">
                {solution.image_url ? (
                  <img 
                    src={getRandomImage()}
                    alt={solution.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-white opacity-50">
                    <Target size={64} />
                  </div>
                )}
              </div>

              {/* Solution Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#213555] mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-700 mb-4">
                  {solution.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center text-[#3E5879]">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Industry: {solution.industry}</span>
                  </div>
                  <div className="flex items-center text-[#3E5879]">
                    <CheckCircle size={16} className="mr-2" />
                    <span className="text-sm">Key Features: {solution.key_features}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Feedbacks Section */}
      <section>
        <div className="flex items-center mb-8">
          <Quote className="text-[#213555] mr-4" size={32} />
          <h2 className="text-3xl font-bold text-[#213555]">
            Client Testimonials
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedbacks.map((feedback) => (
            <div 
              key={feedback.id} 
              className="
                bg-white 
                rounded-lg 
                shadow-md 
                border 
                border-[#D8C4B6] 
                p-6 
                text-center
                transition 
                hover:shadow-lg
              "
            >
              <div className="mb-4">
                {renderStarRating(feedback.rating)}
              </div>
              <p className="text-gray-700 italic mb-4">
                "{feedback.feedback_text}"
              </p>
              <div className="text-sm text-[#3E5879]">
                {/* Placeholder for customer name - to be updated when API includes customer details */}
                <p>Customer Name: {feedback.customer_name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(feedback.feedback_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;