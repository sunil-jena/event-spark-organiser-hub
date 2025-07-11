import React from 'react';
import { StatsCard } from '@/components/ui/stats-card';
import { EventCard, Event } from '@/components/ui/event-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SalesChart } from '@/components/ui/sales-chart';
import { SalesStatistics } from '@/components/ui/sales-statistics';
import { OrderStatistics, OrderStatus } from '@/components/ui/order-statistics';
import { RecentOrders, Order } from '@/components/ui/recent-orders';
import {
  BarChart3,
  CalendarDays,
  Ticket,
  Users,
  TrendingUp,
  PlusCircle,
  ChevronRight,
  IndianRupee,
  Badge,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Summer Music Festival',
    description:
      'A three-day music festival featuring top artists from around the world.',
    date: '2025-06-15',
    location: 'Central Park, New York',
    ticketsSold: 750,
    totalTickets: 1000,
    imageUrl:
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1740',
  },
  {
    id: '2',
    title: 'Tech Conference 2025',
    description: 'Annual conference for tech professionals and enthusiasts.',
    date: '2025-07-22',
    location: 'Convention Center, San Francisco',
    ticketsSold: 350,
    totalTickets: 500,
  },
  {
    id: '3',
    title: 'Food & Wine Expo',
    description: 'Explore the finest cuisines and wines from around the globe.',
    date: '2025-05-10',
    location: 'Harbor Plaza, Seattle',
    ticketsSold: 420,
    totalTickets: 600,
    imageUrl:
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1740',
  },
];

const salesData = [
  { name: 'Jan', online: 4000, offline: 24000, total: 64000 },
  { name: 'Feb', online: 3000, offline: 1398, total: 4398 },
  { name: 'Mar', online: 2000, offline: 9800, total: 11800 },
  { name: 'Apr', online: 2780, offline: 3908, total: 6688 },
  { name: 'May', online: 1890, offline: 4800, total: 6690 },
  { name: 'Jun', online: 2390, offline: 3800, total: 6190 },
  { name: 'Jul', online: 3490, offline: 4300, total: 7790 },
];

const recentOrders: Order[] = [
  {
    id: '1001',
    eventName: 'Summer Music Festival',
    customer: 'John Smith',
    date: 'Apr 3, 2025 12:34 PM',
    amount: 120,
    tickets: 2,
    status: 'completed',
  },
  {
    id: '1002',
    eventName: 'Tech Conference 2025',
    customer: 'Emma Johnson',
    date: 'Apr 2, 2025 10:15 AM',
    amount: 75,
    tickets: 1,
    status: 'pending',
  },
  {
    id: '1003',
    eventName: 'Food & Wine Expo',
    customer: 'Carlos Rodriguez',
    date: 'Apr 1, 2025 3:22 PM',
    amount: 60,
    tickets: 2,
    status: 'completed',
    isOffline: true,
  },
  {
    id: '1004',
    eventName: 'Summer Music Festival',
    customer: 'Sarah Lee',
    date: 'Mar 31, 2025 9:45 AM',
    amount: 180,
    tickets: 3,
    status: 'cancelled',
  },
  {
    id: '1005',
    eventName: 'Tech Conference 2025',
    customer: 'Michael Brown',
    date: 'Mar 30, 2025 5:18 PM',
    amount: 150,
    tickets: 2,
    status: 'refunded',
  },
];

const orderStatsData = [
  { status: 'completed' as OrderStatus, count: 358 },
  { status: 'pending' as OrderStatus, count: 124 },
  { status: 'cancelled' as OrderStatus, count: 23 },
  { status: 'refunded' as OrderStatus, count: 15 },
];

const Dashboard = () => {
  const { toast } = useToast();

  const handleEdit = (event: Event) => {
    toast({
      title: 'Edit Event',
      description: `You are editing ${event.title}`,
    });
  };

  const handleDelete = (event: Event) => {
    toast({
      title: 'Delete Event',
      description: `You requested to delete ${event.title}`,
      variant: 'destructive',
    });
  };

  const handleViewOrder = (order: Order) => {
    toast({
      title: 'View Order',
      description: `Viewing order #${order.id} for ${order.eventName}`,
    });
  };

  const animationConfig = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className='space-y-6 max-w-7xl mx-auto'>
      <motion.div
        className='flex flex-col md:flex-row md:items-center justify-between gap-4'
        initial='hidden'
        animate='visible'
        variants={animationConfig}
      >
        <div>
          <h1 className='text-2xl font-bold'>Dashboard</h1>
          <p className='text-muted-foreground mt-1'>
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <Button className='bg-primary hover:bg-primary/90 flex items-center gap-2'>
          <PlusCircle className='h-4 w-4' />
          <span>Create Event</span>
        </Button>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsCard
            title='Total Revenue'
            value='₹15,25,000'
            icon={<TrendingUp className='h-8 w-8' />}
            trend={{ value: 12.5, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatsCard
            title='Tickets Sold'
            value='1,520'
            icon={<Ticket className='h-8 w-8' />}
            trend={{ value: 8.2, isPositive: true }}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard
            title='Active Events'
            value='5'
            icon={<CalendarDays className='h-8 w-8' />}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatsCard
            title='Total Attendees'
            value='1,250'
            icon={<Users className='h-8 w-8' />}
            trend={{ value: 3.1, isPositive: false }}
          />
        </motion.div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <motion.div
          className='lg:col-span-2'
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SalesChart
            data={salesData}
            title='Sales Overview'
            description='Compare online vs offline ticket sales'
          />
        </motion.div>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SalesStatistics
              data={[
                { name: 'Product A', value: 42000 },
                { name: 'Product B', value: 21000 },
                { name: 'Product C', value: 15000 },
              ]}
              type='products'
              title='Monthly Revenue'
              totalSales={78000}
              onlineSales={56000}
              offlineSales={22000}
              percentageChange={8.5}
              currency='₹'
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <OrderStatistics
              title='Order Status'
              totalOrders={520}
              data={orderStatsData}
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <RecentOrders
          orders={recentOrders}
          onViewOrder={handleViewOrder}
          currency='₹'
        />
      </motion.div>

      <div className='mt-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>Upcoming Events</h2>
          <Button
            variant='outline'
            className='text-primary flex items-center gap-1'
          >
            View All Events
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {mockEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <EventCard
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currency='₹'
              />
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className='bg-gradient-to-br from-primary/90 to-primary-light/80 text-white mb-8'>
          <CardContent className='p-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='md:col-span-2'>
                <h3 className='text-2xl font-bold mb-2'>
                  Manage Your Offline Sales
                </h3>
                <p className='text-white/80 mb-4'>
                  Track your offline ticket sales and manage them efficiently in
                  one place.
                </p>
                <div className='flex gap-3 mt-6'>
                  <Button
                    variant='outline'
                    className='bg-white/10 border-white/20 hover:bg-white/20 text-white hover:text-white/90'
                  >
                    Add Offline Orders
                  </Button>
                  <Button
                    variant='default'
                    className='bg-white text-primary hover:bg-white/90'
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className='hidden md:flex justify-end'>
                <div className='rounded-full bg-white/10 p-6'>
                  <Ticket className='h-16 w-16' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant='outline'
            className='h-auto py-6 flex flex-col items-center justify-center w-full'
            onClick={() => (window.location.href = '/orders')}
          >
            <Ticket className='h-8 w-8 mb-2 text-primary' />
            <span>Manage Orders</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant='outline'
            className='h-auto py-6 flex flex-col items-center justify-center w-full'
            onClick={() => (window.location.href = '/reports')}
          >
            <BarChart3 className='h-8 w-8 mb-2 text-primary' />
            <span>View Reports</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant='outline'
            className='h-auto py-6 flex flex-col items-center justify-center w-full'
            onClick={() => (window.location.href = '/payouts')}
          >
            <IndianRupee className='h-8 w-8 mb-2 text-primary' />
            <span>Payouts</span>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant='outline'
            className='h-auto py-6 flex flex-col items-center justify-center w-full'
          >
            <Badge className='h-8 w-8 mb-2 text-primary' />
            <span>Generate Badges</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
