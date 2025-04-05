
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, CalendarDays, Home, Settings, Users, Ticket, TrendingUp, PieChart, LogOut, ChevronLeft, ChevronRight, MessageSquare, HelpCircle, LayoutDashboard, Calendar, Tag, Clock, ShoppingCart, BarChart, CreditCard, FileText, LucideLayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NavItem, NestedNavigation } from './NestedNavigation';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Events',
    href: '/events',
    icon: <CalendarDays className="h-5 w-5" />,
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

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  minimized: boolean;
  toggleMinimize: () => void;
}

const Sidebar = ({ isMobile, isOpen, onClose, minimized, toggleMinimize }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate()

  const sidebarClasses = cn(
    'flex flex-col h-screen bg-primary text-white transition-all duration-300 ease-in-out overflow-hidden',
    isMobile ? (isOpen ? 'fixed inset-0 z-50' : 'w-0') : minimized ? 'w-16' : 'w-64'
  );

  if (isMobile && !isOpen) return null;

  return (
    <div className={sidebarClasses}>
      <div className="p-4 border-b border-primary-light/20 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {
            minimized &&
            <div className="w-7 h-8 p-1">
              <img src="/logo/logo1.png" alt="" />
            </div>
          }
          {!minimized && <div className="w-30 h-8 p-0">
            <img src="/logo/sm_logo.png" alt="" />
          </div>}
        </div>

      </div>
      {/* Nav sections */}
      <div className="flex-1  py-4 px-3 overflow-hidden">
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

      <div className="p-4 border-t border-primary-light/20">
        <Button
          variant="outline"
          className={cn(
            "bg-transparent border-white/20 hover:bg-white/10  hover:text-white/90 flex items-center gap-2",
            minimized ? "justify-center w-8 h-8 p-0 mx-auto" : "w-full"
          )}
          onClick={() => navigate('/login')}
        >
          <LogOut className="w-4 h-4" />
          {!minimized && <span>Logout</span>}
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
