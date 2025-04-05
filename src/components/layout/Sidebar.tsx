
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, CalendarDays, Home, Settings, Users, Ticket, TrendingUp, PieChart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Events',
    href: '/events',
    icon: CalendarDays,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: Ticket,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: Users,
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: PieChart,
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: TrendingUp,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isMobile, isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  const sidebarClasses = cn(
    'flex flex-col h-screen bg-primary text-white transition-all duration-300 ease-in-out overflow-hidden',
    isMobile ? (isOpen ? 'fixed inset-0 w-64 z-50' : 'w-0') : 'w-64'
  );

  if (isMobile && !isOpen) return null;

  return (
    <div className={sidebarClasses}>
      <div className="p-4 border-b border-primary-light/20">
        <div className="flex items-center space-x-2">
          <span className="bg-primary-light text-white font-bold rounded-md p-1">ES</span>
          <h1 className="text-xl font-semibold">EventSpark</h1>
        </div>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center p-2 rounded-md transition-colors hover:bg-white/10',
                    isActive && 'bg-white/20'
                  )}
                  onClick={isMobile ? onClose : undefined}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-primary-light/20">
        <Button
          variant="outline"
          className="w-full bg-transparent border-white/20 hover:bg-white/10 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
      {isMobile && (
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 bg-transparent hover:bg-white/10"
        >
          ✕
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
