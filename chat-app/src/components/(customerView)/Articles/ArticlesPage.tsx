import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name: string;
  published_date: string;
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

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/articles');
        setArticles(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch articles');
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Function to truncate text
  const truncateText = (text: string, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Function to format date
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
      <h1 className="text-3xl font-bold text-[#213555] mb-8 text-center">
        Our Articles
      </h1>
      <div className="space-y-6">
        {articles.map((article) => (
          <div 
            key={article.id} 
            className="flex bg-white shadow-md rounded-lg overflow-hidden border border-[#D8C4B6]"
          >
            {/* Placeholder Image - Replace with actual image logic */}
            <div className="w-1/3 bg-[#3E5879] flex items-center justify-center">
              <img 
                src={getRandomImage()} 
                alt={article.title} 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Article Content */}
            <div className="w-2/3 p-6">
              {/* Author and Date */}
              <div className="flex justify-between items-center mb-4 text-[#213555]">
                <div className="flex items-center space-x-2">
                  <User size={16} />
                  <span className="text-sm">{article.author_name || 'Unknown Author'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span className="text-sm">
                    {formatDate(article.published_date)}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-semibold text-[#213555] mb-3">
                {article.title}
              </h2>

              {/* Description */}
              <p className="text-gray-700 mb-4">
                {truncateText(article.content)}
              </p>

              {/* Read More Button */}
              <button 
                className="
                  bg-[#213555] text-white 
                  px-4 py-2 rounded-lg 
                  hover:bg-[#3E5879] 
                  transition duration-300
                "
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;