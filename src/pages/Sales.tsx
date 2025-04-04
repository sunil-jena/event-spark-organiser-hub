
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { BarChart, Calendar, ChevronDown, Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SalesData {
  id: string;
  eventName: string;
  date: string;
  tickets: number;
  revenue: number;
  averagePrice: number;
  change: number;
}

const salesData: SalesData[] = [
  {
    id: '1',
    eventName: 'Summer Music Festival',
    date: '2025-04-15',
    tickets: 450,
    revenue: 225000,
    averagePrice: 500,
    change: 12.5,
  },
  {
    id: '2',
    eventName: 'Tech Conference 2025',
    date: '2025-04-22',
    tickets: 320,
    revenue: 480000,
    averagePrice: 1500,
    change: 8.3,
  },
  {
    id: '3',
    eventName: 'Food & Wine Expo',
    date: '2025-05-10',
    tickets: 280,
    revenue: 112000,
    averagePrice: 400,
    change: -3.2,
  },
  {
    id: '4',
    eventName: 'Business Leadership Summit',
    date: '2025-05-18',
    tickets: 180,
    revenue: 360000,
    averagePrice: 2000,
    change: 15.7,
  },
  {
    id: '5',
    eventName: 'Comedy Night Special',
    date: '2025-04-30',
    tickets: 220,
    revenue: 88000,
    averagePrice: 400,
    change: 5.4,
  },
  {
    id: '6',
    eventName: 'Wellness Retreat',
    date: '2025-06-05',
    tickets: 120,
    revenue: 96000,
    averagePrice: 800,
    change: -2.1,
  },
];

// Summary data for metrics
const summaryData = {
  totalRevenue: 1361000,
  ticketsSold: 1570,
  averageTicketPrice: 867,
  revenueGrowth: 8.7
};

const Sales = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('This Month');
  const [selectedEvent, setSelectedEvent] = useState('All Events');

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-muted-foreground">Track your event sales and revenue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Download size={16} />
            Export Report
          </Button>
          <Button className="flex items-center gap-1">
            <BarChart size={16} />
            Generate Insights
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 md:flex-row">
        <Button 
          variant="outline" 
          className="flex items-center gap-1 ml-auto"
          onClick={() => {}}
        >
          <Calendar size={16} />
          {selectedTimeFrame}
          <ChevronDown size={14} />
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => {}}
        >
          <Filter size={16} />
          {selectedEvent}
          <ChevronDown size={14} />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{formatCurrency(summaryData.totalRevenue)}</div>
            <div className="flex items-center mt-1 text-sm">
              {summaryData.revenueGrowth > 0 ? (
                <div className="flex items-center text-green-500">
                  <TrendingUp size={16} className="mr-1" />
                  <span>{summaryData.revenueGrowth}% from last period</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <TrendingDown size={16} className="mr-1" />
                  <span>{Math.abs(summaryData.revenueGrowth)}% from last period</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tickets Sold
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{summaryData.ticketsSold}</div>
            <div className="flex items-center mt-1 text-sm">
              <div className="flex items-center text-green-500">
                <TrendingUp size={16} className="mr-1" />
                <span>6.2% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Ticket Price
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{formatCurrency(summaryData.averageTicketPrice)}</div>
            <div className="flex items-center mt-1 text-sm">
              <div className="flex items-center text-green-500">
                <TrendingUp size={16} className="mr-1" />
                <span>2.5% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">42.8%</div>
            <div className="flex items-center mt-1 text-sm">
              <div className="flex items-center text-red-500">
                <TrendingDown size={16} className="mr-1" />
                <span>1.3% from last period</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader className="p-4 pb-2">
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tickets Sold</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Avg. Price</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.eventName}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.tickets}</TableCell>
                  <TableCell>{formatCurrency(item.revenue)}</TableCell>
                  <TableCell>{formatCurrency(item.averagePrice)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {item.change >= 0 ? (
                        <TrendingUp size={16} className="mr-1" />
                      ) : (
                        <TrendingDown size={16} className="mr-1" />
                      )}
                      <span>{Math.abs(item.change)}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales Chart Placeholder */}
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full flex items-center justify-center bg-muted/20 rounded-md">
            <p className="text-muted-foreground">Sales chart visualization would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sales;
