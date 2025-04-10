import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Ticket,
  ShoppingCart,
  CreditCard,
  BarChart,
  FileText,
  HelpCircle,
  MessageSquare,
  Music,
  Mic,
  Monitor,
  Briefcase,
  Film,
  Award,
  Tag,
  Clock,
  PlusCircle,
  User,
  MapPin,
  FileImage,
  Info,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SidebarItemProps } from '@/components/sidebar/SidebarItem';
import { SidebarMenu } from '@/components/sidebar/SidebarMenu';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EventCreationStep, StepStatus } from '@/components/events/CreateEventSidebar';
import { useAppContext } from '@/contexts/AppContext';
import { useEventContext } from '@/contexts/EventContext';

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
  minimized: boolean;
  toggleMinimize: () => void;
}

// Define the event creation step configuration
const eventStepConfig: Record<EventCreationStep, { label: string; icon: React.ReactNode }> = {
  basicDetails: {
    label: 'Basic Details',
    icon: <User className="h-5 w-5" />
  },
  venues: {
    label: 'Venues',
    icon: <MapPin className="h-5 w-5" />
  },
  dates: {
    label: 'Dates',
    icon: <Calendar className="h-5 w-5" />
  },
  times: {
    label: 'Time Slots',
    icon: <Clock className="h-5 w-5" />
  },
  tickets: {
    label: 'Tickets',
    icon: <Ticket className="h-5 w-5" />
  },
  media: {
    label: 'Media',
    icon: <FileImage className="h-5 w-5" />
  },
  additionalInfo: {
    label: 'Additional Info',
    icon: <Info className="h-5 w-5" />
  },
  review: {
    label: 'Review',
    icon: <CheckCircle className="h-5 w-5" />
  }
};

// Define sidebar navigation items
const mainNavItems: SidebarItemProps[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: <LayoutDashboard className="h-5 w-5" />,
    moduleName: 'dashboard'
  },
  {
    title: 'Events',
    icon: <Calendar className="h-5 w-5" />,
    moduleName: 'events',
    children: [
      {
        title: 'All Events',
        href: '/events',
        moduleName: 'events'
      },
      {
        title: 'Event Details',
        href: '/event-details',
        moduleName: 'events'
      },
      {
        title: 'Create Event',
        href: '/events/create',
        icon: <PlusCircle className="h-4 w-4" />,
        moduleName: 'events',
        children: [
          {
            title: 'Basic Details',
            href: '/events/create#basicDetails',
            icon: <User className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Venues',
            href: '/events/create#venues',
            icon: <MapPin className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Dates',
            href: '/events/create#dates',
            icon: <Calendar className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Time Slots',
            href: '/events/create#times',
            icon: <Clock className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Tickets',
            href: '/events/create#tickets',
            icon: <Ticket className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Media',
            href: '/events/create#media',
            icon: <FileImage className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Additional Info',
            href: '/events/create#additionalInfo',
            icon: <Info className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Review',
            href: '/events/create#review',
            icon: <CheckCircle className="h-4 w-4" />,
            moduleName: 'events'
          }
        ]
      },
      {
        title: 'Categories',
        href: '/events/categories',
        moduleName: 'events',
        children: [
          {
            title: 'Music & Concerts',
            href: '/events/categories/music',
            icon: <Music className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Workshops',
            href: '/events/categories/workshops',
            icon: <Briefcase className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Business',
            href: '/events/categories/business',
            icon: <Monitor className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Dance',
            href: '/events/categories/dance',
            icon: <Award className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Comedy Shows',
            href: '/events/categories/comedy',
            icon: <Mic className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Film Screenings',
            href: '/events/categories/film',
            icon: <Film className="h-4 w-4" />,
            moduleName: 'events'
          },
          {
            title: 'Award Ceremonies',
            href: '/events/categories/awards',
            icon: <Award className="h-4 w-4" />,
            moduleName: 'events'
          }
        ]
      },
      {
        title: 'Venues',
        href: '/events/venues',
        moduleName: 'events'
      }
    ]
  },
  {
    title: 'Tickets',
    icon: <Ticket className="h-5 w-5" />,
    moduleName: 'tickets',
    children: [
      {
        title: 'Ticket Types',
        href: '/tickets/types',
        moduleName: 'tickets'
      },
      {
        title: 'Pricing',
        href: '/tickets/pricing',
        moduleName: 'tickets'
      },
      {
        title: 'Discounts',
        href: '/tickets/discounts',
        label: 'New',
        moduleName: 'tickets',
        children: [
          {
            title: 'Promo Codes',
            href: '/tickets/discounts/promo-codes',
            icon: <Tag className="h-4 w-4" />,
            moduleName: 'tickets'
          },
          {
            title: 'Early Bird',
            href: '/tickets/discounts/early-bird',
            icon: <Clock className="h-4 w-4" />,
            moduleName: 'tickets'
          },
          {
            title: 'Group Discounts',
            href: '/tickets/discounts/group',
            icon: <Users className="h-4 w-4" />,
            moduleName: 'tickets'
          },
        ]
      }
    ]
  },
  {
    title: 'Orders',
    href: '/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
    moduleName: 'orders'
  },
  {
    title: 'Sales',
    href: '/sales',
    icon: <BarChart className="h-5 w-5" />,
    moduleName: 'sales'
  },
  {
    title: 'Customers',
    href: '/customers',
    icon: <Users className="h-5 w-5" />,
    moduleName: 'customers'
  },
  {
    title: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
    moduleName: 'payments',
    children: [
      {
        title: 'Transactions',
        href: '/payments/transactions',
        moduleName: 'payments'
      },
      {
        title: 'Payouts',
        href: '/payouts',
        moduleName: 'payments'
      },
      {
        title: 'Settings',
        href: '/payments/settings',
        moduleName: 'payments'
      }
    ]
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />,
    moduleName: 'reports'
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    moduleName: 'analytics'
  }
];

// Define secondary navigation items
const secondaryNavItems: SidebarItemProps[] = [
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    moduleName: 'settings'
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
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRoute, eventStepStatuses } = useAppContext();
  const { currentStep, setCurrentStep } = useEventContext();

  const hash = location.hash.substring(1);

  const handleEventStepClick = (step: EventCreationStep) => {
    if (eventStepStatuses[step].isClickable) {
      setCurrentStep(step);
      navigate(`/events/create#${step}`);
    }
  };

  const sidebarClasses = cn(
    'flex flex-col h-screen bg-primary text-white transition-all duration-300 ease-in-out overflow-hidden',
    isMobile ? (isOpen ? 'fixed inset-0 z-50' : 'w-0') : minimized ? 'w-16' : 'w-64'
  );

  if (isMobile && !isOpen) return null;

  return (
    <div className={sidebarClasses}>
      <div className={cn(
        "border-b border-primary-light/20 flex items-center",
        minimized ? "justify-center p-2" : "justify-between p-4"
      )}>
        <div className={cn(
          "flex items-center",
          minimized ? "justify-center" : "space-x-2"
        )}>
          {minimized ? (
            <div className="w-7 h-8 p-1 flex items-center justify-center">
              <img src="/logo/logo1.png" alt="Logo" className="max-w-full max-h-full" />
            </div>
          ) : (
            <div className="w-30 h-8 p-0">
              <img src="/logo/sm_logo.png" alt="Logo" className="max-w-full max-h-full" />
            </div>
          )}
        </div>
        
        {!minimized && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={toggleMinimize}
          >
            <Users className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 py-4 overflow-hidden">
        <ScrollArea className="h-full px-1">
          <TooltipProvider delayDuration={200}>
            <SidebarMenu
              mainItems={mainNavItems}
              supportItems={secondaryNavItems}
            />
          </TooltipProvider>
        </ScrollArea>
      </div>

      <div className={cn(
        "border-t border-primary-light/20",
        minimized ? "p-2" : "p-4"
      )}>
        <Button
          variant="outline"
          className={cn(
            "bg-transparent border-white/20 hover:bg-white/10 hover:text-white/90 flex items-center gap-2",
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
