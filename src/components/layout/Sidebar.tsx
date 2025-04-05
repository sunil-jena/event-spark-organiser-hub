
import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  Ticket,
  ShoppingCart,
  CreditCard,
  BarChart,
  BarChart2,
  FileText,
  HelpCircle,
  Star,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NestedNavigation, NavItem } from './NestedNavigation';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  minimized: boolean;
  toggleMinimize: () => void;
}

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Events',
    icon: <Calendar className="h-5 w-5" />,
    children: [
      {
        title: 'All Events',
        href: '/events',
      },
      {
        title: 'Event Details',
        href: '/event-details',
      },
      {
        title: 'Create Event',
        href: '/events/create',
      },
      {
        title: 'Categories',
        href: '/events/categories',
      },
      {
        title: 'Venues',
        href: '/events/venues',
      }
    ]
  },
  {
    title: 'Tickets',
    icon: <Ticket className="h-5 w-5" />,
    children: [
      {
        title: 'Ticket Types',
        href: '/tickets/types',
      },
      {
        title: 'Pricing',
        href: '/tickets/pricing',
      },
      {
        title: 'Discounts',
        href: '/tickets/discounts',
        label: 'New'
      }
    ]
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: <BarChart className="h-5 w-5" />,
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
    children: [
      {
        title: 'Transactions',
        href: '/payments/transactions',
      },
      {
        title: 'Payouts',
        href: '/payouts',
      },
      {
        title: 'Settings',
        href: '/payments/settings',
      }
    ]
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
  }
];

const secondaryNavItems: NavItem[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
  },
  {
    title: 'Support',
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      {
        title: 'Help Center',
        href: '/support/help',
      },
      {
        title: 'Contact Us',
        href: '/support/contact',
      },
      {
        title: 'FAQs',
        href: '/support/faqs',
      }
    ]
  },
  {
    title: 'Feedback',
    href: '/feedback',
    icon: <MessageSquare className="h-5 w-5" />,
  }
];

const Sidebar = ({ isMobile, isOpen, onClose, minimized, toggleMinimize }: SidebarProps) => {
  const location = useLocation();

  const sidebarVariants = {
    open: { 
      x: 0,
      width: minimized ? 80 : 280, 
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    },
    closed: { 
      x: "-100%", 
      width: minimized ? 80 : 280,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 40 
      } 
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full bg-card border-r border-border`}
        variants={sidebarVariants}
        initial={isMobile ? "closed" : "open"}
        animate={isOpen || !isMobile ? "open" : "closed"}
      >
        <div className={`h-full flex flex-col ${minimized ? 'items-center' : ''}`}>
          {/* Logo */}
          <div className={`p-4 border-b border-border flex ${minimized ? 'justify-center' : 'justify-between'} items-center`}>
            {!minimized ? (
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo/black-icon.png" alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-lg">TicketBuddy</span>
              </Link>
            ) : (
              <Link to="/" className="flex items-center justify-center">
                <img src="/logo/black-icon.png" alt="Logo" className="h-8 w-auto" />
              </Link>
            )}
            
            {!minimized && !isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMinimize}
                className="rounded-full h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Nav sections */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-6">
              <div>
                {!minimized && <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Main</h2>}
                <NestedNavigation items={mainNavItems} minimized={minimized} />
              </div>

              <div>
                {!minimized && <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">Support</h2>}
                <NestedNavigation items={secondaryNavItems} minimized={minimized} />
              </div>
            </nav>
          </div>

          {/* User profile section */}
          <div className={`p-4 border-t border-border mt-auto ${minimized ? 'text-center' : ''}`}>
            {!minimized ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                    <span className="text-sm font-medium text-primary">AR</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Ankit Raj</p>
                    <p className="text-xs text-muted-foreground">admin@ticketbuddy.com</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/logout">
                    <LogOut className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link to="/profile">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">AR</span>
                  </div>
                </Link>
              </Button>
            )}
          </div>
          
          {/* Minimize/Expand button for non-mobile */}
          {!isMobile && minimized && (
            <div className="p-4 flex justify-center">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleMinimize}
                className="rounded-full h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
