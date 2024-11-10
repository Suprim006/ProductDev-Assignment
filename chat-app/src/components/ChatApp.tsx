'use client';
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatApp = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      text: userMessage, 
      sender: 'user'
    }]);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        text: data.response,
        sender: 'ai'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error getting the response.',
        sender: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-center">Gemini AI Chatbot</h1>
        </div>
        
        <div className="h-[500px] overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.sender === 'ai' ? 'pl-4' : 'pr-4'}`}
            >
              <div className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'error' ? 'bg-red-100 text-red-800' :
                  message.sender === 'ai' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  <div className="font-semibold mb-1">
                    {message.sender === 'ai' ? 'AI' : message.sender === 'error' ? 'Error' : 'You'}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              <span>AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;