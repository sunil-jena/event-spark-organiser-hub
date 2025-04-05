
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Calendar, ChartBar, Ticket, Users } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Revenue" 
          value="$15,250" 
          icon={<ChartBar className="h-8 w-8" />} 
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
          icon={<Calendar className="h-8 w-8" />} 
        />
        <StatsCard 
          title="Total Attendees" 
          value="1,250" 
          icon={<Users className="h-8 w-8" />} 
          trend={{ value: 3.1, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Revenue analysis for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <ChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chart visualization will be displayed here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ticket Sales</CardTitle>
            <CardDescription>Tickets sold per event</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chart visualization will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
          <CardDescription>Comparative performance of your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3">Event Name</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3">Tickets Sold</th>
                  <th scope="col" className="px-6 py-3">Revenue</th>
                  <th scope="col" className="px-6 py-3">Attendance Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Summer Music Festival</td>
                  <td className="px-6 py-4">Jun 15, 2025</td>
                  <td className="px-6 py-4">750/1000</td>
                  <td className="px-6 py-4">$7,500</td>
                  <td className="px-6 py-4">75%</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Tech Conference 2025</td>
                  <td className="px-6 py-4">Jul 22, 2025</td>
                  <td className="px-6 py-4">350/500</td>
                  <td className="px-6 py-4">$5,250</td>
                  <td className="px-6 py-4">70%</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4 font-medium">Food & Wine Expo</td>
                  <td className="px-6 py-4">May 10, 2025</td>
                  <td className="px-6 py-4">420/600</td>
                  <td className="px-6 py-4">$2,500</td>
                  <td className="px-6 py-4">70%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
