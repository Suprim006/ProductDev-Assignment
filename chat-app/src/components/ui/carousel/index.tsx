"use client";

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Types for Carousel and CarouselItem
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "fullWidth"
  itemsToShow?: number
  autoSlide?: boolean
  autoSlideInterval?: number
}

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  image?: string
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  variant = "default",
  itemsToShow = 1,
  autoSlide = false,
  autoSlideInterval = 3000,
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const childrenArray = React.Children.toArray(children)

  // Auto-sliding effect
  React.useEffect(() => {
    if (!autoSlide) return

    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % childrenArray.length
      )
    }, autoSlideInterval)

    return () => clearInterval(slideInterval)
  }, [autoSlide, autoSlideInterval, childrenArray.length])

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? childrenArray.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % childrenArray.length
    )
  }

  return (
    <div 
      className={cn(
        "relative w-full max-w-xs",
        {
          "max-w-full": variant === "fullWidth"
        },
        className
      )}
      {...props}
    >
      <div 
        className={cn(
          "flex transition-transform duration-500 ease-in-out",
          {
            "space-x-4": variant === "default",
            "space-x-0": variant === "fullWidth"
          }
        )}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          width: `${childrenArray.length * 100}%`
        }}
      >
        {childrenArray.map((child, index) => (
          <div 
            key={index}
            className={cn(
              "w-full shrink-0",
              {
                "md:w-1/2 lg:w-1/3": variant === "default" && itemsToShow > 1,
                "w-full": itemsToShow === 1 || variant === "fullWidth"
              }
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="text-[#213555] hover:bg-[#D8C4B6] hover:text-[#3E5879]"
        >
          &lt;
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="text-[#213555] hover:bg-[#D8C4B6] hover:text-[#3E5879]"
        >
          &gt;
        </Button>
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center mt-2 space-x-2">
        {childrenArray.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full cursor-pointer",
              index === currentIndex 
                ? "bg-[#213555]" 
                : "bg-[#D8C4B6]"
            )}
          />
        ))}
      </div>
    </div>
  )
}

const CarouselItem: React.FC<CarouselItemProps> = ({
  title,
  description,
  image,
  className,
  children,
  ...props
}) => {
  return (
    <Card 
      className={cn(
        "border border-[#3E5879]/10 shadow-sm rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title || "Carousel item image"} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
      )}
      <CardContent className="p-8 space-y-4 bg-[#F5EFE7]">
        {title && (
            <h3 className="text-2xl font-semibold text-[#213555]">
            {title}
            </h3>
        )}
        {description && (
            <p className="text-[#3E5879] leading-relaxed">
            {description}
            </p>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

export { Carousel, CarouselItem }