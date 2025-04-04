
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { SalesChart } from '@/components/ui/sales-chart';
import { OrderStatistics } from '@/components/ui/order-statistics';
import { SalesStatistics } from '@/components/ui/sales-statistics';
import { 
  BarChart3, 
  CalendarDays, 
  Ticket, 
  Users,
  Calendar,
  PieChartIcon, // Renamed to avoid conflict with recharts
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart, // This is from recharts
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Sales data for the chart
const salesData = [
  { name: 'Jan', online: 4000, offline: 2400, total: 6400 },
  { name: 'Feb', online: 3000, offline: 1398, total: 4398 },
  { name: 'Mar', online: 2000, offline: 9800, total: 11800 },
  { name: 'Apr', online: 2780, offline: 3908, total: 6688 },
  { name: 'May', online: 1890, offline: 4800, total: 6690 },
  { name: 'Jun', online: 2390, offline: 3800, total: 6190 },
  { name: 'Jul', online: 3490, offline: 4300, total: 7790 },
];

// Order statistics data with proper types
const orderStatsData = [
  { status: 'completed' as const, count: 358 },
  { status: 'pending' as const, count: 124 },
  { status: 'cancelled' as const, count: 23 },
  { status: 'refunded' as const, count: 15 },
];

// Audience data for pie chart
const audienceData = [
  { name: '18-24', value: 25 },
  { name: '25-34', value: 40 },
  { name: '35-44', value: 20 },
  { name: '45+', value: 15 },
];

// Event performance data
const eventPerformanceData = [
  {
    name: 'Summer Music Festival',
    date: 'Jun 15, 2025',
    ticketsSold: 750,
    totalTickets: 1000,
    revenue: 7500,
    attendanceRate: 75,
  },
  {
    name: 'Tech Conference 2025',
    date: 'Jul 22, 2025',
    ticketsSold: 350,
    totalTickets: 500,
    revenue: 5250,
    attendanceRate: 70,
  },
  {
    name: 'Food & Wine Expo',
    date: 'May 10, 2025',
    ticketsSold: 420,
    totalTickets: 600,
    revenue: 2500,
    attendanceRate: 70,
  },
  {
    name: 'Art Exhibition',
    date: 'Aug 5, 2025',
    ticketsSold: 280,
    totalTickets: 350,
    revenue: 1400,
    attendanceRate: 80,
  },
  {
    name: 'Business Summit',
    date: 'Sep 18, 2025',
    ticketsSold: 180,
    totalTickets: 300,
    revenue: 3600,
    attendanceRate: 60,
  },
];

// Colors for pie chart
const COLORS = ['#24005b', '#7b4ebc', '#9d7ad5', '#c3aae9'];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your performance and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={timeRange === 'week' ? 'bg-primary text-white' : ''} onClick={() => setTimeRange('week')}>
            Week
          </Button>
          <Button variant="outline" size="sm" className={timeRange === 'month' ? 'bg-primary text-white' : ''} onClick={() => setTimeRange('month')}>
            Month
          </Button>
          <Button variant="outline" size="sm" className={timeRange === 'year' ? 'bg-primary text-white' : ''} onClick={() => setTimeRange('year')}>
            Year
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$15,250" 
          icon={<TrendingUp className="h-8 w-8" />} 
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard 
          title="Tickets Sold" 
          value="1,520" 
          icon={<Ticket className="h-8 w-8" />} 
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatsCard 
          title="Active Events" 
          value="5" 
          icon={<CalendarDays className="h-8 w-8" />} 
        />
        <StatsCard 
          title="Total Attendees" 
          value="1,250" 
          icon={<Users className="h-8 w-8" />} 
          trend={{ value: 3.1, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart 
          data={salesData} 
          title="Revenue Overview"
          description="Revenue analysis for the past 6 months"
          className="lg:col-span-2"
        />
        
        <div className="space-y-6">
          <SalesStatistics
            title="Ticket Sales"
            totalSales={15250}
            onlineSales={12450}
            offlineSales={2800}
            percentageChange={8.2}
          />
          
          <OrderStatistics
            title="Order Status"
            totalOrders={520}
            data={orderStatsData}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Ticket Type</CardTitle>
            <CardDescription>Distribution of ticket sales by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'VIP', value: 580 },
                    { name: 'Standard', value: 750 },
                    { name: 'Early Bird', value: 320 },
                    { name: 'Group', value: 250 },
                    { name: 'Student', value: 180 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} tickets`, 'Sales']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                  <Bar dataKey="value" fill="#24005b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>Age distribution of your attendees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={audienceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {audienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Comparative performance of your events</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Download Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs font-medium uppercase bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Event Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Tickets Sold</th>
                  <th scope="col" className="px-6 py-3">Revenue</th>
                  <th scope="col" className="px-6 py-3">Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                {eventPerformanceData.map((event, index) => (
                  <tr 
                    key={index} 
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 font-medium">{event.name}</td>
                    <td className="px-6 py-4">{event.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{event.ticketsSold}/{event.totalTickets}</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">${event.revenue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{event.attendanceRate}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              event.attendanceRate >= 75 ? 'bg-green-500' : 
                              event.attendanceRate >= 50 ? 'bg-amber-500' : 
                              'bg-red-500'
                            }`} 
                            style={{ width: `${event.attendanceRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
