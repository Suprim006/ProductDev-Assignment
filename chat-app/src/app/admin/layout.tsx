'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Briefcase,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Manage Users', href: '/admin/users', icon: <Users size={20} /> },
    { label: 'Customer Inquiries', href: '/admin/inquiries', icon: <MessageSquare size={20} /> },
    { label: 'Manage Articles', href: '/admin/articles', icon: <FileText size={20} /> },
    { label: 'Manage Events', href: '/admin/events', icon: <Calendar size={20} /> },
    { label: 'Past Solutions', href: '/admin/solutions', icon: <Briefcase size={20} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasSession = document.cookie.includes('session=');
        if (!hasSession && pathname !== '/admin/login') {
          router.push('/admin/login');
        } else if (hasSession && pathname === '/admin/login') {
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('user');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EFE7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213555]"></div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen flex bg-[#F5EFE7]">
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-[#213555] text-white transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'} z-50
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[#3E5879]">
          <h1 className={`font-bold ${isOpen ? 'block' : 'hidden'}`}>Admin Panel</h1>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-[#3E5879] rounded">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center px-4 py-3 transition-colors
                ${pathname === item.href ? 'bg-[#3E5879] text-white' : 'text-gray-300 hover:bg-[#3E5879]'}
              `}
            >
              {item.icon}
              <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>{item.label}</span>
            </Link>
          ))}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-[#3E5879] transition-colors"
          >
            <LogOut size={20} />
            <span className={`ml-4 ${isOpen ? 'block' : 'hidden'}`}>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#213555]">
              {navItems.find(item => item.href === pathname)?.label || 'Admin'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}