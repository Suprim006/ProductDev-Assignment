'use client';

import React from 'react';
import EventsPage from '@/components/(customerView)/Events/EventsPage'; // Adjust the import path as needed

export default function ArticlesPageWrapper() {
  return (
    <div className="bg-[#F5EFE7] p-4 mt-4">
      <EventsPage />
    </div>
  );
}