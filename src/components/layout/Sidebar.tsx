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
  MessageSquare,
  Music,
  Mic,
  Monitor,
  Briefcase,
  Film,
  Award,
  Tag,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NestedNavigation, NavItem } from './NestedNavigation';
import { TooltipProvider } from '@/components/ui/tooltip';

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
        children: [
          {
            title: 'Music & Concerts',
            href: '/events/categories/music',
            icon: <Music className="h-4 w-4" />,
          },
          {
            title: 'Workshops',
            href: '/events/categories/workshops',
            icon: <Briefcase className="h-4 w-4" />,
          },
          {
            title: 'Business',
            href: '/events/categories/business',
            icon: <Monitor className="h-4 w-4" />,
          },
          {
            title: 'Dance',
            href: '/events/categories/dance',
            icon: <Star className="h-4 w-4" />,
          },
          {
            title: 'Comedy Shows',
            href: '/events/categories/comedy',
            icon: <Mic className="h-4 w-4" />,
          },
          {
            title: 'Film Screenings',
            href: '/events/categories/film',
            icon: <Film className="h-4 w-4" />,
          },
          {
            title: 'Award Ceremonies',
            href: '/events/categories/awards',
            icon: <Award className="h-4 w-4" />,
          }
        ]
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
        label: 'New',
        children: [
          {
            title: 'Promo Codes',
            href: '/tickets/discounts/promo-codes',
            icon: <Tag className="h-4 w-4" />,
          },
          {
            title: 'Early Bird',
            href: '/tickets/discounts/early-bird',
            icon: <Clock className="h-4 w-4" />,
          },
          {
            title: 'Group Discounts',
            href: '/tickets/discounts/group',
            icon: <Users className="h-4 w-4" />,
          },
        ]
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

  // Custom brand color styles
  const sidebarStyle = {
    background: '#9b87f5',
    color: 'white'
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
      <TooltipProvider>
        <motion.aside
          className="fixed top-0 left-0 z-50 h-full border-r border-purple-300"
          style={sidebarStyle}
          variants={sidebarVariants}
          initial={isMobile ? "closed" : "open"}
          animate={isOpen || !isMobile ? "open" : "closed"}
        >
          <div className={`h-full flex flex-col ${minimized ? 'items-center' : ''}`}>
            {/* Logo */}
            <div className={`p-4 border-b border-purple-300 flex ${minimized ? 'justify-center' : 'justify-between'} items-center`}>
              {!minimized ? (
                <Link to="/" className="flex items-center gap-2">
                  <img src="/logo/white-icon.png" alt="Logo" className="h-8 w-auto" />
                  <span className="font-bold text-lg text-white">TicketBuddy</span>
                </Link>
              ) : (
                <Link to="/" className="flex items-center justify-center">
                  <img src="/logo/white-icon.png" alt="Logo" className="h-8 w-auto" />
                </Link>
              )}
              
              {!minimized && !isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMinimize}
                  className="rounded-full h-8 w-8 hover:bg-purple-400/20 text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
              <nav className="space-y-6">
                <div>
                  {!minimized && <h2 className="mb-2 px-4 text-xs font-semibold text-white/80">Main</h2>}
                  <NestedNavigation items={mainNavItems} minimized={minimized} className="text-white" />
                </div>

                <div>
                  {!minimized && <h2 className="mb-2 px-4 text-xs font-semibold text-white/80">Support</h2>}
                  <NestedNavigation items={secondaryNavItems} minimized={minimized} className="text-white" />
                </div>
              </nav>
            </div>

            {/* User profile section */}
            <div className={`p-4 border-t border-purple-300 mt-auto ${minimized ? 'text-center' : ''}`}>
              {!minimized ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center mr-2">
                      <span className="text-sm font-medium text-purple-700">AR</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Ankit Raj</p>
                      <p className="text-xs text-white/70">admin@ticketbuddy.com</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-purple-400/20" asChild>
                    <Link to="/logout">
                      <LogOut className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-purple-400/20" asChild>
                  <Link to="/profile">
                    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-700">AR</span>
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
                  className="rounded-full h-8 w-8 border-white text-white hover:bg-purple-400/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.aside>
      </TooltipProvider>
    </>
  );
};

export default Sidebar;
