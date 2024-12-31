'use client';

import React from 'react';
import ArticlesPage from '@/components/(customerView)/Articles/ArticlesPage'; // Adjust the import path as needed

export default function ArticlesPageWrapper() {
  return (
    <div className="bg-[#F5EFE7] p-4 mt-4">
      <ArticlesPage />
    </div>
  );
}