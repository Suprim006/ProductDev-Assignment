"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from 'lucide-react';

interface CarouselItemType {
  title: string;
  description: string;
  image?: string;
}

const HeroSection: React.FC = () => {
  const carouselItems: CarouselItemType[] = [
    {
      title: "AI Powered Chatbot",
      description: "Revolutionize your customer interaction with our cutting-edge AI-powered chatbot, leveraging the advanced Gemini language model enhanced by Retrieval-Augmented Generation (RAG) technology. This intelligent solution dynamically adapts to your specific company's knowledge base, providing contextually rich and precisely tailored responses.",
      image: "/images/articles/pexels-tara-winstead-8849295.jpg"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-[#F5EFE7] via-white to-[#F5EFE7] py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row items-center gap-12"
        >
          {/* Text Content */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-3/5 space-y-8"
          >
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-600 font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Next Generation AI Solutions
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-[#213555] leading-tight">
                Transform Your Business with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI Innovation
                </span>
              </h1>
            </div>

            <div className="w-full">
              <Carousel 
                className="w-full max-w-full rounded-xl bg-white/50 backdrop-blur-sm p-6 shadow-lg"
                variant="fullWidth"
                autoSlide={true}
                autoSlideInterval={5000}
              >
                {carouselItems.map((item, index) => (
                  <CarouselItem 
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    className="w-full"
                  >
                    <div className="flex flex-wrap gap-4 mt-6">
                      <Button 
                        variant="default" 
                        className="bg-[#213555] hover:bg-[#3E5879] text-white group relative overflow-hidden transition-all duration-300"
                      >
                        <span className="relative z-10">Get Started</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-2 border-[#3E5879] text-[#3E5879] hover:bg-[#3E5879] hover:text-white transition-all duration-300"
                      >
                        Schedule Demo
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-2/5"
          >
            <div className="relative">
              <motion.div 
                className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-30 blur-xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.4, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/images/pexels-googledeepmind-17483868.jpg" 
                  alt="AI Solution Illustration"
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add custom styles for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;