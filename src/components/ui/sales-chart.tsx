
import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SalesData {
  name: string;
  online: number;
  offline: number;
  total: number;
}

interface SalesChartProps {
  data: SalesData[];
  title: string;
  description?: string;
  className?: string;
}

type ChartView = 'daily' | 'weekly' | 'monthly';

export function SalesChart({
  data,
  title,
  description,
  className,
}: SalesChartProps) {
  const [chartView, setChartView] = useState<ChartView>('monthly');
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  // In a real app, this would filter data based on the selected view
  const filteredData = data;

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-none", 
                  chartView === 'daily' && "bg-primary text-white hover:bg-primary/90"
                )}
                onClick={() => setChartView('daily')}
              >
                Daily
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-none", 
                  chartView === 'weekly' && "bg-primary text-white hover:bg-primary/90"
                )}
                onClick={() => setChartView('weekly')}
              >
                Weekly
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-none", 
                  chartView === 'monthly' && "bg-primary text-white hover:bg-primary/90"
                )}
                onClick={() => setChartView('monthly')}
              >
                Monthly
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setChartType(chartType === 'area' ? 'bar' : 'area')}
            >
              {chartType === 'area' ? 'Bar' : 'Area'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24005b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#24005b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOffline" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7b4ebc" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7b4ebc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E5E7EB'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="online" 
                  stroke="#24005b" 
                  fillOpacity={1} 
                  fill="url(#colorOnline)" 
                  name="Online Sales"
                />
                <Area 
                  type="monotone" 
                  dataKey="offline" 
                  stroke="#7b4ebc" 
                  fillOpacity={1} 
                  fill="url(#colorOffline)" 
                  name="Offline Sales"
                />
              </AreaChart>
            ) : (
              <BarChart data={filteredData}>
                <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#E5E7EB' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    border: '1px solid #E5E7EB'
                  }}
                />
                <Legend />
                <Bar dataKey="online" fill="#24005b" name="Online Sales" radius={[4, 4, 0, 0]} />
                <Bar dataKey="offline" fill="#7b4ebc" name="Offline Sales" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
