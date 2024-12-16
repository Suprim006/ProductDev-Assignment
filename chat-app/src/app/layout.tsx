// src/app/layout.tsx
import React from 'react';
import CustomerLayout from './(customerView)/layout'; // Reuse customerView layout

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return <CustomerLayout>{children}</CustomerLayout>;
}
