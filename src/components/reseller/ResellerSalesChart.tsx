import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Order } from '../../types';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  Filter,
  BarChart3,
  Percent,
} from 'lucide-react';

type TimeRange = '7d' | '14d' | '30d' | '6m' | '12m';

interface ResellerSalesChartProps {
  orders: Order[];
}

interface ChartDataPoint {
  key: string;
  label: string;
  fullDate: string;
  sales: number;
  profit: number;
  ordersCount: number;
}

export const ResellerSalesChart: React.FC<ResellerSalesChartProps> = ({ orders }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered'>('all');
  const [showSales, setShowSales] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  const [showOrders, setShowOrders] = useState(false);

  // Filter orders by status if requested
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'delivered') {
      return orders.filter((o) => o.status === 'DELIVERED' || o.status === 'PAID');
    }
    return orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'RETURNED');
  }, [orders, statusFilter]);

  // Aggregate data points based on time range (Daily vs Monthly)
  const { chartData, summary } = useMemo(() => {
    const now = new Date();
    const isMonthly = timeRange === '6m' || timeRange === '12m';
    const pointMap = new Map<string, ChartDataPoint>();

    if (!isMonthly) {
      // Daily mode (7, 14, 30 days)
      const numDays = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const fullDate = d.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        pointMap.set(key, {
          key,
          label,
          fullDate,
          sales: 0,
          profit: 0,
          ordersCount: 0,
        });
      }

      // Aggregate filtered orders into daily buckets
      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) return;
        const yyyy = orderDate.getFullYear();
        const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
        const dd = String(orderDate.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;

        if (pointMap.has(key)) {
          const pt = pointMap.get(key)!;
          pt.sales += order.totalAmount || 0;
          pt.profit += order.totalResellerProfit || 0;
          pt.ordersCount += 1;
        }
      });
    } else {
      // Monthly mode (6 or 12 months)
      const numMonths = timeRange === '6m' ? 6 : 12;
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const key = `${yyyy}-${mm}`;
        const label = d.toLocaleDateString('en-US', { month: 'short' });
        const fullDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        pointMap.set(key, {
          key,
          label,
          fullDate,
          sales: 0,
          profit: 0,
          ordersCount: 0,
        });
      }

      // Aggregate filtered orders into monthly buckets
      filteredOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) return;
        const yyyy = orderDate.getFullYear();
        const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
        const key = `${yyyy}-${mm}`;

        if (pointMap.has(key)) {
          const pt = pointMap.get(key)!;
          pt.sales += order.totalAmount || 0;
          pt.profit += order.totalResellerProfit || 0;
          pt.ordersCount += 1;
        }
      });
    }

    const data = Array.from(pointMap.values());

    // Compute period summary
    const totalSales = data.reduce((sum, pt) => sum + pt.sales, 0);
    const totalProfit = data.reduce((sum, pt) => sum + pt.profit, 0);
    const totalOrders = data.reduce((sum, pt) => sum + pt.ordersCount, 0);
    const avgProfitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100).toFixed(1) : '0';

    return {
      chartData: data,
      summary: {
        totalSales,
        totalProfit,
        totalOrders,
        avgProfitMargin,
      },
    };
  }, [filteredOrders, timeRange]);

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6"
      id="reseller-sales-performance-chart"
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Sales & Earnings Performance
              </h3>
              <p className="text-xs text-slate-500">
                Track revenue trends, resale margin growth, and order velocity
              </p>
            </div>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Active
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-2.5 py-1 rounded-lg transition ${
                statusFilter === 'delivered'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Delivered Only
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(
              [
                { id: '7d', label: '7D' },
                { id: '14d', label: '14D' },
                { id: '30d', label: '30D' },
                { id: '6m', label: '6M' },
                { id: '12m', label: '1Y' },
              ] as { id: TimeRange; label: string }[]
            ).map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  timeRange === range.id
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini KPI Highlights for selected range */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            Period Sales
          </p>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            ৳{summary.totalSales.toLocaleString()}
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Reseller Profit
          </p>
          <p className="text-base sm:text-lg font-black text-indigo-700 mt-0.5">
            ৳{summary.totalProfit.toLocaleString()}
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
            Total Orders
          </p>
          <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
            {summary.totalOrders}
          </p>
        </div>

        <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            Profit Margin
          </p>
          <p className="text-base sm:text-lg font-black text-amber-700 mt-0.5">
            {summary.avgProfitMargin}%
          </p>
        </div>
      </div>

      {/* Metric Toggles & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSales}
              onChange={(e) => setShowSales(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 accent-emerald-600"
            />
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Customer Sales (৳)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showProfit}
              onChange={(e) => setShowProfit(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 accent-indigo-600"
            />
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Your Profit (৳)
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOrders}
              onChange={(e) => setShowOrders(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500 w-3.5 h-3.5 accent-amber-500"
            />
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Orders Count
            </span>
          </label>
        </div>

        <span className="text-[11px] text-slate-400">
          Showing {timeRange === '6m' || timeRange === '12m' ? 'Monthly' : 'Daily'} performance
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v) => (v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`)}
            />
            {showOrders && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#d97706', fontSize: 11 }}
                allowDecimals={false}
              />
            )}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xl border border-slate-800 text-xs space-y-2 min-w-[190px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-slate-200">{data.fullDate}</span>
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                          {data.ordersCount} {data.ordersCount === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      <div className="space-y-1 pt-0.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            Customer Sales:
                          </span>
                          <span className="font-black text-emerald-400">
                            ৳{data.sales.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            Reseller Profit:
                          </span>
                          <span className="font-black text-indigo-300">
                            +৳{data.profit.toLocaleString()}
                          </span>
                        </div>
                        {data.sales > 0 && (
                          <div className="flex items-center justify-between gap-4 text-[11px] pt-1 border-t border-slate-800 text-slate-400">
                            <span>Margin Rate:</span>
                            <span className="font-bold text-amber-300">
                              {((data.profit / data.sales) * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {showSales && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                name="Sales (৳)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
            {showProfit && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                name="Profit (৳)"
                stroke="#6366f1"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                dot={{ r: 3, fill: '#6366f1', strokeWidth: 1, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
            {showOrders && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ordersCount"
                name="Orders"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 2.5, fill: '#f59e0b' }}
                activeDot={{ r: 5, fill: '#f59e0b' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
