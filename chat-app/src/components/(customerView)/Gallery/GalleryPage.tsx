import React, { useState, useEffect, useRef, useCallback } from 'react';

const imageList = [
  {
    url: "/images/articles/pexels-cottonbro-6153345.jpg",
    aspectRatio: "4/3"
  },
  {
    url: "/images/articles/pexels-googledeepmind-17483868.jpg",
    aspectRatio: "16/9"
  },
  {
    url: "/images/articles/pexels-kindelmedia-8566445.jpg",
    aspectRatio: "1/1"
  },
  {
    url: "/images/articles/pexels-pavel-danilyuk-8439089.jpg",
    aspectRatio: "3/4"
  },
  {
    url: "/images/articles/pexels-sanketgraphy-16587314.jpg",
    aspectRatio: "16/9"
  },
  {
    url: "/images/articles/pexels-santesson89-17325393.jpg",
    aspectRatio: "4/3"
  },
  {
    url: "/images/articles/pexels-shvetsa-5614108.jpg",
    aspectRatio: "1/1"
  },
  {
    url: "/images/articles/pexels-tara-winstead-8849277.jpg",
    aspectRatio: "3/4"
  },
  {
    url: "/images/articles/pexels-zamanisahudi-101764.jpg",
    aspectRatio: "16/9"
  }
];

const GalleryPage = () => {
  const [displayedImages, setDisplayedImages] = useState<string[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && availableImages.length > 0) {
        loadMoreImages();
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, availableImages]);

  useEffect(() => {
    const initializeGallery = () => {
      const urls = imageList.map(img => img.url);
      setAvailableImages(urls);
      
      const initialImages: string[] = [];
      for (let i = 0; i < 6 && i < urls.length; i++) {
        const randomIndex = Math.floor(Math.random() * urls.length);
        const selectedImage = urls[randomIndex];
        urls.splice(randomIndex, 1);
        initialImages.push(selectedImage);
      }
      setDisplayedImages(initialImages);
      setAvailableImages(urls);
    };

    initializeGallery();
  }, []);

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * availableImages.length);
    const selectedImage = availableImages[randomIndex];
    setAvailableImages(prev => prev.filter(img => img !== selectedImage));
    return selectedImage;
  };

  const loadMoreImages = () => {
    setLoading(true);
    const newImages: string[] = [];
    for (let i = 0; i < 3; i++) {
      if (availableImages.length > 0) {
        const img = getRandomImage();
        newImages.push(img);
      }
    }
    setDisplayedImages(prev => [...prev, ...newImages]);
    setLoading(false);
  };

  const getImageAspectRatio = (url: string) => {
    const image = imageList.find(img => img.url === url);
    return image?.aspectRatio || "1/1";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#213555] text-center mb-8">
        Our Gallery
      </h1>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {displayedImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            ref={index === displayedImages.length - 1 ? lastImageRef : null}
            className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 mb-4 break-inside-avoid"
          >
            <img
              src={image}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              style={{
                aspectRatio: getImageAspectRatio(image)
              }}
            />
            <div className="absolute inset-0 bg-[#213555] bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#213555]"></div>
        </div>
      )}

      {availableImages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No more images to load
        </div>
      )}
    </div>
  );
};

export default GalleryPage;