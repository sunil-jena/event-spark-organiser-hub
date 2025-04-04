
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import { OrderStatistics } from '@/components/ui/order-statistics';
import { 
  BarChart3, 
  CalendarDays, 
  Ticket, 
  DollarSign,
  Users, 
  ArrowLeft, 
  Download,
  Edit,
  Share,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// Mock event data
const mockEvent = {
  id: '1',
  title: 'Summer Music Festival',
  description: 'A three-day music festival featuring top artists from around the world.',
  date: '2025-06-15',
  location: 'Central Park, New York',
  ticketsSold: 750,
  totalTickets: 1000,
  revenue: 75000,
  imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1740',
  ticketTypes: [
    { name: 'VIP', sold: 150, total: 200, price: 250 },
    { name: 'Standard', sold: 400, total: 500, price: 100 },
    { name: 'Early Bird', sold: 200, total: 300, price: 75 }
  ],
  dailySales: [
    { date: 'Feb 1', sales: 12 },
    { date: 'Feb 15', sales: 19 },
    { date: 'Mar 1', sales: 25 },
    { date: 'Mar 15', sales: 38 },
    { date: 'Apr 1', sales: 42 },
    { date: 'Apr 15', sales: 55 },
    { date: 'May 1', sales: 70 },
    { date: 'May 15', sales: 89 },
    { date: 'Jun 1', sales: 110 },
    { date: 'Jun 10', sales: 140 },
  ],
  salesProjection: [
    { date: 'Current', sales: 750 },
    { date: 'Projected', sales: 900 }
  ],
  attendeeData: [
    { age: '18-24', value: 30 },
    { age: '25-34', value: 45 },
    { age: '35-44', value: 15 },
    { age: '45+', value: 10 }
  ],
  genderData: [
    { name: 'Male', value: 55 },
    { name: 'Female', value: 40 },
    { name: 'Other', value: 5 }
  ],
  orderStats: [
    { status: 'completed' as const, count: 358 },
    { status: 'pending' as const, count: 124 },
    { status: 'cancelled' as const, count: 23 },
    { status: 'refunded' as const, count: 15 }
  ],
  recentOrders: [
    {
      id: '1001',
      customer: 'John Smith',
      email: 'john@example.com',
      date: 'Apr 3, 2025 12:34 PM',
      amount: 250,
      ticketType: 'VIP',
      tickets: 1
    },
    {
      id: '1002',
      customer: 'Emma Johnson',
      email: 'emma@example.com',
      date: 'Apr 2, 2025 10:15 AM',
      amount: 200,
      ticketType: 'VIP',
      tickets: 2
    },
    {
      id: '1003',
      customer: 'Carlos Rodriguez',
      email: 'carlos@example.com',
      date: 'Apr 1, 2025 3:22 PM',
      amount: 150,
      ticketType: 'Standard',
      tickets: 3
    },
    {
      id: '1004',
      customer: 'Sarah Lee',
      email: 'sarah@example.com',
      date: 'Mar 31, 2025 9:45 AM',
      amount: 75,
      ticketType: 'Early Bird',
      tickets: 1
    },
    {
      id: '1005',
      customer: 'Michael Brown',
      email: 'michael@example.com',
      date: 'Mar 30, 2025 5:18 PM',
      amount: 250,
      ticketType: 'VIP',
      tickets: 1
    }
  ],
  promotionStats: {
    socialMedia: 35,
    emailCampaign: 25,
    partnerships: 15,
    direct: 25
  }
};

// Colors for charts
const COLORS = ['#24005b', '#7b4ebc', '#9d7ad5', '#c3aae9'];

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Calculate completion percentage
  const soldPercentage = Math.round((mockEvent.ticketsSold / mockEvent.totalTickets) * 100);
  const daysLeft = Math.round((new Date(mockEvent.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  const handleExport = () => {
    toast({
      title: "Report Exported",
      description: `Event report for ${mockEvent.title} has been exported`
    });
  };
  
  const handleEdit = () => {
    toast({
      title: "Edit Event",
      description: `You are now editing ${mockEvent.title}`
    });
  };
  
  const handleShare = () => {
    toast({
      title: "Share Link Generated",
      description: "Event link has been copied to clipboard"
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-primary">
        <Button variant="ghost" className="p-0 h-8 w-8" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span>Back to Events</span>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="rounded-lg overflow-hidden h-48 md:h-64 relative">
            <img 
              src={mockEvent.imageUrl} 
              alt={mockEvent.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-2xl md:text-3xl font-bold">{mockEvent.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>{new Date(mockEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3 flex flex-col gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Days Left:</span>
                  <span className="font-bold">{daysLeft} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Location:</span>
                  <span>{mockEvent.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tickets Sold:</span>
                  <span>{mockEvent.ticketsSold} / {mockEvent.totalTickets}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Revenue:</span>
                  <span className="font-bold">${mockEvent.revenue.toLocaleString()}</span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ticket Sales Progress</span>
                    <span className="font-medium">{soldPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${soldPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="projections">Projections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <StatsCard 
              title="Total Revenue" 
              value={`$${mockEvent.revenue.toLocaleString()}`} 
              icon={<DollarSign className="h-8 w-8" />} 
            />
            <StatsCard 
              title="Tickets Sold" 
              value={`${mockEvent.ticketsSold} / ${mockEvent.totalTickets}`} 
              icon={<Ticket className="h-8 w-8" />} 
              trend={{ value: soldPercentage, isPositive: true }}
            />
            <StatsCard 
              title="Days Until Event" 
              value={daysLeft} 
              icon={<CalendarDays className="h-8 w-8" />} 
            />
            <StatsCard 
              title="Average Ticket Price" 
              value={`$${Math.round(mockEvent.revenue / mockEvent.ticketsSold)}`} 
              icon={<BarChart3 className="h-8 w-8" />} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Ticket sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={mockEvent.dailySales}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#24005b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#24005b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip 
                        formatter={(value) => [`${value} tickets`, 'Sales']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E5E7EB'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#24005b" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <OrderStatistics
                title="Order Status"
                totalOrders={mockEvent.orderStats.reduce((acc, curr) => acc + curr.count, 0)}
                data={mockEvent.orderStats}
              />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ticket Type Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockEvent.ticketTypes.map((type) => {
                      const soldPercentage = Math.round((type.sold / type.total) * 100);
                      
                      return (
                        <div key={type.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{type.name}</span>
                            <span className="text-sm text-gray-500">
                              {type.sold}/{type.total} ({soldPercentage}%)
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500">Price: ${type.price}</span>
                            <span className="text-gray-500">
                              Revenue: ${(type.sold * type.price).toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${soldPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest 5 ticket purchases</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvent.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.ticketType}</TableCell>
                        <TableCell>{order.tickets}</TableCell>
                        <TableCell>${order.amount}</TableCell>
                        <TableCell className="text-muted-foreground">{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Promotion Channel Effectiveness</CardTitle>
                <CardDescription>Breakdown of ticket sales by promotional channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Social Media', value: mockEvent.promotionStats.socialMedia },
                          { name: 'Email Campaign', value: mockEvent.promotionStats.emailCampaign },
                          { name: 'Partnerships', value: mockEvent.promotionStats.partnerships },
                          { name: 'Direct', value: mockEvent.promotionStats.direct },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Social Media', value: mockEvent.promotionStats.socialMedia },
                          { name: 'Email Campaign', value: mockEvent.promotionStats.emailCampaign },
                          { name: 'Partnerships', value: mockEvent.promotionStats.partnerships },
                          { name: 'Direct', value: mockEvent.promotionStats.direct },
                        ].map((entry, index) => (
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>Complete list of orders for this event</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tickets</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockEvent.recentOrders.concat(mockEvent.recentOrders).map((order, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer}</div>
                            <div className="text-sm text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.ticketType}</TableCell>
                        <TableCell>{order.tickets}</TableCell>
                        <TableCell>${order.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
                <CardDescription>Breakdown of attendees by age group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockEvent.attendeeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="age"
                        label={({ age, percent }) => `${age}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockEvent.attendeeData.map((entry, index) => (
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
            
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
                <CardDescription>Breakdown of attendees by gender</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={mockEvent.genderData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {mockEvent.genderData.map((entry, index) => (
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
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Where your attendees are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Map Visualization</h3>
                  <p className="text-muted-foreground max-w-md">
                    A geographic map visualization would be displayed here showing the distribution of attendees by location.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Sales Projection</CardTitle>
                <CardDescription>Projected ticket sales until event date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockEvent.salesProjection}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="date" />
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
                      <Legend />
                      <Bar dataKey="sales" fill="#24005b" name="Ticket Sales">
                        <Cell fill="#24005b" />
                        <Cell fill="#7b4ebc" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Financial projections for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Current Revenue:</span>
                    <span className="font-bold">${mockEvent.revenue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Projected Revenue:</span>
                    <span className="font-bold">${(mockEvent.revenue * 1.2).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Revenue Goal:</span>
                    <span className="font-bold">${(mockEvent.revenue * 1.5).toLocaleString()}</span>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress to Goal</span>
                      <span className="font-medium">{Math.round((mockEvent.revenue / (mockEvent.revenue * 1.5)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${Math.round((mockEvent.revenue / (mockEvent.revenue * 1.5)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mt-6">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Send email promotion to past attendees</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Increase social media advertising budget</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Offer early bird discounts for the remaining tickets</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventDetails;
