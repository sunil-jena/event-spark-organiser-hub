import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Update SalesStatisticsProps to accept the data format being passed
export interface SalesStatisticsProps {
  // Either accept the original data format with online/offline/total
  // or add a more flexible format for different chart types
  data: Array<{
    name: string;
    value?: number;
    online?: number;
    offline?: number;
    total?: number;
  }>;
  type: 'pie' | 'bar' | 'line';
}

export function SalesStatistics({ data, type }: SalesStatisticsProps) {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#9c6ade'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {
              data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))
            }
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  } else if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  } else {
    return <p>Unsupported chart type</p>;
  }
}
