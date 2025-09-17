import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';
import { ChartDataPoint } from '@/types';
import { Button } from '@/components/dashboard/ui/button';
import { cn } from '@/lib/utils';

interface ChartSectionProps {
  chartData: ChartDataPoint[];
  isLive: boolean;
}

type ChartType = 'line' | 'area' | 'bar';
type TimeRange = '5m' | '15m' | '1h' | 'all';

const ChartSection: React.FC<ChartSectionProps> = ({ chartData, isLive }) => {
  const [activeChart, setActiveChart] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'pH', 'turbidity', 'temperature', 'overallScore'
  ]);

  const chartTypes = [
    { type: 'line' as ChartType, icon: TrendingUp, label: 'Line Chart' },
    { type: 'area' as ChartType, icon: Activity, label: 'Area Chart' },
    { type: 'bar' as ChartType, icon: BarChart3, label: 'Bar Chart' },
  ];

  const timeRanges = [
    { range: '5m' as TimeRange, label: '5 min' },
    { range: '15m' as TimeRange, label: '15 min' },
    { range: '1h' as TimeRange, label: '1 hour' },
    { range: 'all' as TimeRange, label: 'All' },
  ];

  const metrics = [
    { key: 'pH', label: 'pH Level', color: '#3B82F6', unit: '' },
    { key: 'turbidity', label: 'Turbidity', color: '#F59E0B', unit: 'NTU' },
    { key: 'temperature', label: 'Temperature', color: '#EF4444', unit: '°C' },
    { key: 'conductivity', label: 'Conductivity', color: '#8B5CF6', unit: 'μS/cm' },
    { key: 'eColi', label: 'E.coli', color: '#DC2626', unit: 'CFU' },
    { key: 'overallScore', label: 'Quality Score', color: '#10B981', unit: '%' },
  ];

  const getFilteredData = () => {
    let filtered = chartData;
    
    if (timeRange !== 'all') {
      const now = new Date();
      const minutes = timeRange === '5m' ? 5 : timeRange === '15m' ? 15 : 60;
      const cutoff = new Date(now.getTime() - minutes * 60 * 1000);
      
      filtered = chartData.filter(point => {
        const pointTime = new Date();
        const [time] = point.timestamp.split(' ');
        const [hours, mins, seconds] = time.split(':').map(Number);
        pointTime.setHours(hours, mins, seconds || 0);
        return pointTime >= cutoff;
      });
    }
    
    return filtered.slice(-20); // Keep last 20 points for performance
  };

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey)
        ? prev.filter(m => m !== metricKey)
        : [...prev, metricKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {metrics.find(m => m.key === entry.dataKey)?.unit}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const filteredData = getFilteredData();

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const renderLines = () => 
      selectedMetrics.map(metricKey => {
        const metric = metrics.find(m => m.key === metricKey);
        if (!metric) return null;

        return activeChart === 'line' ? (
          <Line
            key={metricKey}
            type="monotone"
            dataKey={metricKey}
            stroke={metric.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: metric.color, strokeWidth: 2 }}
          />
        ) : activeChart === 'area' ? (
          <Area
            key={metricKey}
            type="monotone"
            dataKey={metricKey}
            stackId="1"
            stroke={metric.color}
            fill={`${metric.color}20`}
          />
        ) : (
          <Bar
            key={metricKey}
            dataKey={metricKey}
            fill={metric.color}
            opacity={0.8}
          />
        );
      });

    const ChartComponent = activeChart === 'line' ? LineChart : 
                          activeChart === 'area' ? AreaChart : BarChart;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="timestamp" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {renderLines()}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Real-time Analytics
            </h2>
            <p className="text-sm text-muted-foreground">
              Historical trends and live data visualization
            </p>
          </div>
          {isLive && (
            <div className="flex items-center gap-2">
              <div className="pulse-live w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success">Live</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Selector */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {chartTypes.map(({ type, icon: Icon, label }) => (
              <Button
                key={type}
                variant={activeChart === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveChart(type)}
                className={cn(
                  "rounded-none border-0",
                  activeChart === type && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {timeRanges.map(({ range, label }) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={cn(
                  "rounded-none border-0 text-xs",
                  timeRange === range && "bg-primary text-primary-foreground"
                )}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Toggles */}
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics.map(metric => (
          <Button
            key={metric.key}
            variant={selectedMetrics.includes(metric.key) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleMetric(metric.key)}
            className={cn(
              "text-xs transition-all duration-200",
              selectedMetrics.includes(metric.key) ? 
                "shadow-md" : 
                "opacity-60 hover:opacity-100"
            )}
            style={{
              backgroundColor: selectedMetrics.includes(metric.key) ? metric.color : undefined,
              borderColor: metric.color,
              color: selectedMetrics.includes(metric.key) ? 'white' : metric.color,
            }}
          >
            {metric.label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full">
        {filteredData.length > 0 ? (
          renderChart()
        ) : (
          <div className="h-96 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No data available for the selected time range</p>
              <p className="text-sm">Start monitoring to see live data</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Statistics */}
      {filteredData.length > 0 && (
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-foreground">
                {filteredData.length}
              </div>
              <div className="text-xs text-muted-foreground">Data Points</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {selectedMetrics.length}
              </div>
              <div className="text-xs text-muted-foreground">Active Metrics</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {filteredData[filteredData.length - 1]?.overallScore.toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Current Quality</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {timeRange === 'all' ? 'All Time' : timeRange}
              </div>
              <div className="text-xs text-muted-foreground">Time Range</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSection;