
import React from 'react';
import { Menu, Bell, Search, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold hidden md:block">Organizer Hub</h1>
      </div>
      
      <div className="hidden md:flex max-w-md w-full mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search events, orders, customers..."
            className="w-full pl-10 rounded-full border-gray-200 focus:border-primary"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Calendar className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-primary w-2 h-2 rounded-full"></span>
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 p-1 rounded-full border border-gray-200"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <span className="font-medium text-sm hidden sm:block mr-1">John Doe</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
