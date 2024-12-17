import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatContainerRef.current && 
        !chatContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      text: userMessage, 
      sender: 'user'
    }]);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
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
    <div ref={chatContainerRef} className="fixed bottom-8 left-8 z-50">
      {/* Floating Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center 
          shadow-lg transition-colors duration-300
          ${isOpen 
            ? 'bg-[#3E5879] text-white' 
            : 'bg-[#213555] text-white hover:bg-[#3E5879]'
          }
        `}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 left-0 w-80 bg-white rounded-xl shadow-2xl border border-[#D8C4B6]"
          >
            {/* Chat Header */}
            <div className="bg-[#213555] text-white p-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-lg font-semibold">AI Chatbot</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#3E5879] p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-[#F5EFE7]">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`
                    flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div 
                    className={`
                      max-w-[80%] p-3 rounded-lg 
                      ${message.sender === 'user' 
                        ? 'bg-[#3E5879] text-white' 
                        : 'bg-white border border-[#D8C4B6] text-[#213555]'
                      }
                    `}
                  >
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#D8C4B6] text-[#213555] p-3 rounded-lg">
                    <div className="flex items-center">
                      <span className="animate-pulse mr-2">●●●</span>
                      AI is thinking...
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white rounded-b-xl border-t border-[#D8C4B6]">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="
                    flex-1 p-2 border border-[#D8C4B6] rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-[#3E5879]
                  "
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="
                    bg-[#213555] text-white p-2 rounded-lg 
                    hover:bg-[#3E5879] disabled:opacity-50
                  "
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbot;