
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  Download,
  CalendarDays,
  Ticket,
  DollarSign,
  Users,
  Calendar,
} from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reports
const salesByEvent = [
  { name: 'Summer Music Festival', revenue: 75000, tickets: 750 },
  { name: 'Tech Conference 2025', revenue: 52500, tickets: 350 },
  { name: 'Food & Wine Expo', revenue: 25000, tickets: 420 },
  { name: 'Art Exhibition', revenue: 14000, tickets: 280 },
  { name: 'Business Summit', revenue: 36000, tickets: 180 },
];

const monthlyRevenue = [
  { name: 'Jan', revenue: 40000, lastYear: 35000 },
  { name: 'Feb', revenue: 45000, lastYear: 38000 },
  { name: 'Mar', revenue: 55000, lastYear: 45000 },
  { name: 'Apr', revenue: 70000, lastYear: 60000 },
  { name: 'May', revenue: 90000, lastYear: 75000 },
  { name: 'Jun', revenue: 110000, lastYear: 90000 },
  { name: 'Jul', revenue: 95000, lastYear: 85000 },
  { name: 'Aug', revenue: 80000, lastYear: 70000 },
  { name: 'Sep', revenue: 100000, lastYear: 85000 },
  { name: 'Oct', revenue: 120000, lastYear: 100000 },
  { name: 'Nov', revenue: 115000, lastYear: 95000 },
  { name: 'Dec', revenue: 125000, lastYear: 110000 },
];

const ticketTypePerformance = [
  { name: 'VIP', percentage: 35, tickets: 580, revenue: 72500 },
  { name: 'Standard', percentage: 45, tickets: 750, revenue: 45000 },
  { name: 'Early Bird', percentage: 12, tickets: 320, revenue: 16000 },
  { name: 'Group', percentage: 8, tickets: 250, revenue: 10000 },
];

const salesChannels = [
  { name: 'Website', value: 65 },
  { name: 'Mobile App', value: 20 },
  { name: 'Partners', value: 10 },
  { name: 'Box Office', value: 5 },
];

// Colors for charts
const COLORS = ['#24005b', '#7b4ebc', '#9d7ad5', '#c3aae9'];

const Reports = () => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<string>('year');
  const [reportType, setReportType] = useState<string>('sales');
  
  const handleExport = () => {
    toast({
      title: "Report Exported",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been exported as CSV`
    });
  };
  
  // Calculate total revenue
  const totalRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
  
  // Calculate total tickets
  const totalTickets = salesByEvent.reduce((acc, curr) => acc + curr.tickets, 0);
  
  // Calculate average ticket price
  const averageTicketPrice = Math.round(totalRevenue / totalTickets);
  
  // Calculate year-over-year growth
  const currentYearRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
  const lastYearRevenue = monthlyRevenue.reduce((acc, curr) => acc + curr.lastYear, 0);
  const yoyGrowth = Math.round(((currentYearRevenue - lastYearRevenue) / lastYearRevenue) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1">Analyze your event performance and sales</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          icon={<DollarSign className="h-8 w-8" />} 
          trend={{ value: yoyGrowth, isPositive: yoyGrowth > 0 }}
        />
        <StatsCard 
          title="Total Tickets Sold" 
          value={totalTickets.toLocaleString()} 
          icon={<Ticket className="h-8 w-8" />} 
        />
        <StatsCard 
          title="Average Ticket Price" 
          value={`$${averageTicketPrice.toLocaleString()}`} 
          icon={<BarChart3 className="h-8 w-8" />} 
        />
        <StatsCard 
          title="Total Events" 
          value={salesByEvent.length.toString()} 
          icon={<CalendarDays className="h-8 w-8" />} 
        />
      </div>
      
      <Tabs value={reportType} onValueChange={setReportType} className="w-full">
        <TabsList className="grid grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="events">Event Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue comparison with previous year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyRevenue}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          border: '1px solid #E5E7EB'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" name="This Year" fill="#24005b" />
                      <Bar dataKey="lastYear" name="Last Year" fill="#9d7ad5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales Channels</CardTitle>
                <CardDescription>Revenue by sales channel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesChannels}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesChannels.map((entry, index) => (
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
              <CardTitle>Ticket Type Performance</CardTitle>
              <CardDescription>Sales breakdown by ticket type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>% of Total</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg. Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ticketTypePerformance.map((type) => (
                      <TableRow key={type.name}>
                        <TableCell className="font-medium">{type.name}</TableCell>
                        <TableCell>{type.tickets.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{type.percentage}%</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full" 
                                style={{ width: `${type.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${type.revenue.toLocaleString()}</TableCell>
                        <TableCell>${Math.round(type.revenue / type.tickets)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">{ticketTypePerformance.reduce((acc, curr) => acc + curr.tickets, 0).toLocaleString()}</TableCell>
                      <TableCell className="font-bold">100%</TableCell>
                      <TableCell className="font-bold">${ticketTypePerformance.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}</TableCell>
                      <TableCell className="font-bold">${Math.round(ticketTypePerformance.reduce((acc, curr) => acc + curr.revenue, 0) / ticketTypePerformance.reduce((acc, curr) => acc + curr.tickets, 0))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Events</CardTitle>
              <CardDescription>Events ranked by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesByEvent.sort((a, b) => b.revenue - a.revenue)}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tickFormatter={(value) => `$${value / 1000}k`} />
                    <YAxis dataKey="name" type="category" width={110} />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === 'revenue') return [`$${Number(value).toLocaleString()}`, 'Revenue'];
                        return [value, name];
                      }}
                      contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '6px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        border: '1px solid #E5E7EB'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#24005b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Event Performance Comparison</CardTitle>
              <CardDescription>Detailed performance metrics for all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Tickets Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg. Ticket Price</TableHead>
                      <TableHead>Sell-Through Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesByEvent.map((event, index) => {
                      // Mock total tickets and sell-through rate
                      const totalTickets = event.tickets * (100 / (50 + Math.random() * 50));
                      const sellThroughRate = Math.round((event.tickets / totalTickets) * 100);
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{event.name}</TableCell>
                          <TableCell>
                            {new Date(2025, index, 10 + index * 5).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>{event.tickets}</TableCell>
                          <TableCell>${event.revenue.toLocaleString()}</TableCell>
                          <TableCell>${Math.round(event.revenue / event.tickets)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{sellThroughRate}%</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    sellThroughRate >= 75 ? 'bg-green-500' : 
                                    sellThroughRate >= 50 ? 'bg-amber-500' : 
                                    'bg-red-500'
                                  }`}
                                  style={{ width: `${sellThroughRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>Age distribution of your attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '18-24', value: 25 },
                          { name: '25-34', value: 40 },
                          { name: '35-44', value: 20 },
                          { name: '45+', value: 15 },
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
                          { name: '18-24', value: 25 },
                          { name: '25-34', value: 40 },
                          { name: '35-44', value: 20 },
                          { name: '45+', value: 15 },
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendee Geolocation</CardTitle>
                <CardDescription>Geographic distribution of your attendees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center p-6 border-2 border-dashed rounded-lg">
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
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
              <CardDescription>Repeat attendance patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'First-time', value: 65 },
                      { name: 'Second-time', value: 20 },
                      { name: '3-5 Events', value: 10 },
                      { name: '6+ Events', value: 5 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Percentage']}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
