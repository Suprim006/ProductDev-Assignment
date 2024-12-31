import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCircle, X, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([
    {
      text: "Hello! I'm your virtual AI assistant. How can I help you today?",
      sender: 'ai'
    }
  ]);
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
        text: 'Sorry, there was an error getting the response. Please try again.',
        sender: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={chatContainerRef} className="fixed bottom-4 left-4 z-50">
      {/* Floating Chat Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center 
          shadow-lg transition-colors duration-300
          ${isOpen 
            ? 'bg-[#3E5879] text-white' 
            : 'bg-[#213555] text-white hover:bg-[#3E5879]'
          }
        `}
      >
        {isOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 left-0 w-[calc(100vw-2rem)] sm:w-[350px] md:w-[400px] lg:w-[450px] max-w-[500px] bg-white rounded-xl shadow-2xl border border-[#D8C4B6]"
          >
            {/* Chat Header */}
            <div className="bg-[#213555] text-white p-3 md:p-4 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5 md:w-6 md:h-6" />
                <h2 className="text-base md:text-lg font-semibold">AI Virtual Assistant</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#3E5879] p-1 rounded-full"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-[50vh] md:h-[60vh] max-h-[500px] overflow-y-auto p-3 md:p-4 space-y-3 bg-[#F5EFE7]">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`
                    flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
                  `}
                >
                  <div 
                    className={`
                      max-w-[85%] p-2 md:p-3 rounded-lg text-sm md:text-base
                      ${
                        message.sender === 'user' 
                          ? 'bg-[#3E5879] text-white' 
                          : message.sender === 'error'
                            ? 'bg-red-100 text-red-800 border border-red-200'
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
                  <div className="bg-white border border-[#D8C4B6] text-[#213555] p-2 md:p-3 rounded-lg text-sm md:text-base">
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
            <div className="p-3 md:p-4 bg-white rounded-b-xl border-t border-[#D8C4B6]">
              <form onSubmit={sendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading}
                  className="
                    flex-1 p-2 border border-[#D8C4B6] rounded-lg text-sm md:text-base
                    focus:outline-none focus:ring-2 focus:ring-[#3E5879]
                    text-gray-800 placeholder-gray-500
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
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
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