"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, User, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name: string;
  published_date: string;
}

const ArticleDetailPage = ({ articleId }: { articleId: string }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/articles/${articleId}`);
        setArticle(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch article');
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

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

  if (error || !article) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Article not found'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-[#213555] mb-6 hover:text-[#3E5879] transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Articles
      </button>

      <article className="bg-white rounded-lg shadow-lg p-8 border border-[#D8C4B6]">
        <div className="flex justify-between items-center mb-6 text-[#213555]">
          <div className="flex items-center space-x-2">
            <User size={16} />
            <span>{article.author_name || 'Unknown Author'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>{formatDate(article.published_date)}</span>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#213555] mb-6">
          {article.title}
        </h1>

        <div className="prose max-w-none text-gray-700">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-[#D8C4B6]">
          <span className="inline-block bg-[#F5EFE7] text-[#213555] px-3 py-1 rounded-full text-sm">
            {article.category}
          </span>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;