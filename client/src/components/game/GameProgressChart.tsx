import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Financial Progress</CardTitle>
        <CardDescription>Game performance over time</CardDescription>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Not enough data to display a chart
          </div>
        ) : (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={snapshots}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                  label={{ value: 'Day', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  width={60}
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
                  fillOpacity={1}
                  fill="url(#netWorthGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="cash" 
                  name="Cash"
                  stroke="#4caf50" 
                  fillOpacity={1}
                  fill="url(#cashGradient)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="debt" 
                  name="Debt"
                  stroke="#f44336" 
                  fillOpacity={1}
                  fill="url(#debtGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}