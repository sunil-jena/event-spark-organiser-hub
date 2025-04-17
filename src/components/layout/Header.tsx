import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  Calendar,
  X,
  IndianRupee,
  Ticket,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  onMenuClick: () => void;
  minimized?: boolean;
  toggleMinimize?: () => void;
  toggleSearch?: () => void;
  toggleNotifications?: () => void;
  toggleDatePicker?: () => void;
  isSearchOpen?: boolean;
  isNotificationsOpen?: boolean;
  isDatePickerOpen?: boolean;
}

const Header = ({
  onMenuClick,
  minimized,
  toggleMinimize,
  toggleSearch: externalToggleSearch,
  toggleNotifications: externalToggleNotifications,
  toggleDatePicker: externalToggleDatePicker,
  isSearchOpen: externalSearchOpen,
  isNotificationsOpen: externalNotificationsOpen,
  isDatePickerOpen: externalDatePickerOpen,
}: HeaderProps) => {
  const isMobile = useIsMobile();
  const [internalSearchOpen, setInternalSearchOpen] = useState(false);
  const [internalCalendarOpen, setInternalCalendarOpen] = useState(false);
  const [internalNotificationsOpen, setInternalNotificationsOpen] =
    useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const searchOpen =
    externalSearchOpen !== undefined ? externalSearchOpen : internalSearchOpen;
  const calendarOpen =
    externalDatePickerOpen !== undefined
      ? externalDatePickerOpen
      : internalCalendarOpen;
  const notificationsOpen =
    externalNotificationsOpen !== undefined
      ? externalNotificationsOpen
      : internalNotificationsOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        if (externalToggleDatePicker) {
          externalToggleDatePicker();
        } else {
          setInternalCalendarOpen(false);
        }
      }

      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        if (externalToggleNotifications) {
          externalToggleNotifications();
        } else {
          setInternalNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    calendarOpen,
    notificationsOpen,
    externalToggleDatePicker,
    externalToggleNotifications,
  ]);

  const toggleSearch = () => {
    if (externalToggleSearch) {
      externalToggleSearch();
    } else {
      setInternalSearchOpen(!internalSearchOpen);
      if (internalCalendarOpen) setInternalCalendarOpen(false);
      if (internalNotificationsOpen) setInternalNotificationsOpen(false);
    }
  };

  const toggleCalendar = () => {
    if (externalToggleDatePicker) {
      externalToggleDatePicker();
    } else {
      setInternalCalendarOpen(!internalCalendarOpen);
      if (internalSearchOpen) setInternalSearchOpen(false);
      if (internalNotificationsOpen) setInternalNotificationsOpen(false);
    }
  };

  const toggleNotifications = () => {
    if (externalToggleNotifications) {
      externalToggleNotifications();
    } else {
      setInternalNotificationsOpen(!internalNotificationsOpen);
      if (internalSearchOpen) setInternalSearchOpen(false);
      if (internalCalendarOpen) setInternalCalendarOpen(false);
    }
  };

  return (
    <header className='h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-4 shadow-sm'>
      <div className='flex items-center'>
        <Button
          variant='ghost'
          size='icon'
          className='lg:hidden mr-2'
          onClick={onMenuClick}
        >
          <Menu className='h-6 w-6' />
        </Button>
        {!isMobile && minimized !== undefined && toggleMinimize && (
          <Button
            variant='ghost'
            size='icon'
            className='mr-2 hidden lg:flex'
            onClick={toggleMinimize}
          >
            <Menu className='h-6 w-6' />
          </Button>
        )}
      </div>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            className='absolute left-0 right-0 top-0 bg-white dark:bg-gray-900 z-10 h-16 px-4 flex items-center'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              type='search'
              placeholder='Search events, orders, customers...'
              className='w-full rounded-full border-gray-200 focus:border-primary'
              autoFocus
            />
            <Button
              variant='ghost'
              size='icon'
              className='ml-2'
              onClick={toggleSearch}
            >
              <X className='h-5 w-5' />
            </Button>
          </motion.div>
        ) : (
          <div className='hidden md:flex max-w-md w-full mx-4'>
            <div className='relative w-full'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                type='search'
                placeholder='Search events, orders, customers...'
                className='w-full pl-10 rounded-full border-gray-200 focus:border-primary'
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <div className='flex items-center gap-3'>
        <Button
          variant='ghost'
          size='icon'
          className='relative hidden sm:flex'
          onClick={toggleCalendar}
        >
          <Calendar className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='relative md:hidden'
          onClick={toggleSearch}
        >
          <Search className='h-5 w-5' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='relative'
          onClick={toggleNotifications}
        >
          <Bell className='h-5 w-5' />
          <span className='absolute top-1 right-1 bg-primary w-2 h-2 rounded-full'></span>
        </Button>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            className='flex items-center gap-2 p-1 rounded-full border border-gray-200'
          >
            <div className='w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white'>
              <User className='h-4 w-4' />
            </div>
            <span className='font-medium text-sm hidden sm:block mr-1'>
              Rohit Sharma
            </span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {calendarOpen && (
          <motion.div
            ref={calendarRef}
            className='absolute top-16 right-24 z-20'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className='w-96 shadow-lg'>
              <CardContent className='p-4'>
                <h3 className='font-medium mb-2'>Upcoming Events</h3>
                <div className='space-y-3'>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-10 h-10 bg-primary/10 text-primary flex flex-col items-center justify-center rounded-md'>
                      <span className='text-xs font-bold'>APR</span>
                      <span className='text-sm'>15</span>
                    </div>
                    <div>
                      <p className='font-medium text-sm'>
                        Summer Music Festival
                      </p>
                      <p className='text-xs text-gray-500'>
                        10:00 AM - 08:00 PM
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-10 h-10 bg-primary/10 text-primary flex flex-col items-center justify-center rounded-md'>
                      <span className='text-xs font-bold'>APR</span>
                      <span className='text-sm'>22</span>
                    </div>
                    <div>
                      <p className='font-medium text-sm'>
                        Tech Conference 2025
                      </p>
                      <p className='text-xs text-gray-500'>
                        09:00 AM - 05:00 PM
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-10 h-10 bg-primary/10 text-primary flex flex-col items-center justify-center rounded-md'>
                      <span className='text-xs font-bold'>MAY</span>
                      <span className='text-sm'>10</span>
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Food & Wine Expo</p>
                      <p className='text-xs text-gray-500'>
                        11:00 AM - 07:00 PM
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant='outline' className='w-full mt-3 text-sm h-8'>
                  View All Events
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notificationsOpen && (
          <motion.div
            ref={notificationsRef}
            className='absolute top-16 right-16 z-20'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className='w-80 shadow-lg'>
              <CardContent className='p-4'>
                <h3 className='font-medium mb-2'>Notifications</h3>
                <div className='space-y-3'>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-8 h-8 bg-green-100 text-green-600 flex items-center justify-center rounded-full'>
                      <IndianRupee className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>
                        New payment received
                      </p>
                      <p className='text-xs text-gray-500'>
                        ₹12,500 from Tech Conference
                      </p>
                      <p className='text-xs text-gray-400'>10 minutes ago</p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-8 h-8 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full'>
                      <Ticket className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>
                        New booking confirmed
                      </p>
                      <p className='text-xs text-gray-500'>
                        5 tickets for Summer Music Festival
                      </p>
                      <p className='text-xs text-gray-400'>1 hour ago</p>
                    </div>
                  </div>
                  <div className='flex gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer'>
                    <div className='w-8 h-8 bg-amber-100 text-amber-600 flex items-center justify-center rounded-full'>
                      <Bell className='h-4 w-4' />
                    </div>
                    <div>
                      <p className='font-medium text-sm'>Event reminder</p>
                      <p className='text-xs text-gray-500'>
                        Food & Wine Expo starts in 3 days
                      </p>
                      <p className='text-xs text-gray-400'>5 hours ago</p>
                    </div>
                  </div>
                </div>
                <Button variant='outline' className='w-full mt-3 text-sm h-8'>
                  View All Notifications
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
