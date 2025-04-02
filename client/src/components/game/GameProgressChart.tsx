import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DailySnapshot } from '../../lib/api';
import { Loader2 } from 'lucide-react';

interface GameProgressChartProps {
  snapshots: DailySnapshot[];
  loading?: boolean;
}

export default function GameProgressChart({ snapshots, loading = false }: GameProgressChartProps) {
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Ensure we have at least two data points for a proper chart
  const hasData = snapshots.length >= 2;
  
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Not enough data to display a chart
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={snapshots}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4caf50" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f44336" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f44336" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              width={55}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value)]}
              labelFormatter={(day) => `Day ${day}`}
            />
            
            <Area 
              type="monotone" 
              dataKey="netWorth" 
              name="Net Worth"
              stroke="#8884d8" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#netWorthGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="cash" 
              name="Cash"
              stroke="#4caf50" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#cashGradient)" 
            />
            <Area 
              type="monotone" 
              dataKey="debt" 
              name="Debt"
              stroke="#f44336" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#debtGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </>
  );
}