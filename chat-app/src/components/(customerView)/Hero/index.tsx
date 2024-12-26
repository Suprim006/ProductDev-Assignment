"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Define the structure for a carousel item
interface CarouselItemType {
  title: string;
  description: string;
  image?: string;
}

const HeroSection: React.FC = () => {
  // Carousel items data
  const carouselItems: CarouselItemType[] = [
    {
      title: "AI Powered Chatbot",
      description: "Revolutionize your customer interaction with our cutting-edge AI-powered chatbot, leveraging the advanced Gemini language model enhanced by Retrieval-Augmented Generation (RAG) technology. This intelligent solution dynamically adapts to your specific company's knowledge base, providing contextually rich and precisely tailored responses. By seamlessly integrating your unique organizational data, our chatbot goes beyond generic interactions, offering deep, nuanced insights that reflect your company's specific terminology, processes, and customer experience. The RAG implementation ensures that each interaction is not just intelligent, but intimately aligned with your business's core knowledge, creating a personalized AI assistant that understands and represents your brand with unprecedented accuracy and depth.",
      image: "" // Placeholder image path
    }
  ];

  return (
    <section className="bg-[#F5EFE7] py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Text Content - 2/3 of the width */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-2/3 space-y-6"
          >
            <h1 className="text-4xl font-bold text-[#213555]">
              Transform Your Business with AI
            </h1>
            <div className="w-full">
              <Carousel 
                className="w-full max-w-full"
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
                    <div className="space-x-4 mt-4">
                      <Button variant="default" className="bg-[#213555] hover:bg-[#3E5879] text-[#F5EFE7]">
                        Learn More
                      </Button>
                      <Button variant="outline" className="border-[#3E5879] text-[#3E5879] hover:bg-[#D8C4B6]">
                        Schedule Demo
                      </Button>
                    </div>
                  </CarouselItem>
                ))}
              </Carousel>
            </div>
          </motion.div>

          {/* Image/Visualization Content - 1/3 of the width */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/3 flex justify-center items-center"
          >
            <div className="aspect-w-4 aspect-h-3 w-full max-w-sm">
              <img 
                src="/images/pexels-googledeepmind-17483868.jpg" 
                alt="AI Solution Illustration"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;