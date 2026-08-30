import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Order, ResellerProfile, Wallet } from '../../types';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type TimeRange = '7d' | '14d' | '30d' | '90d' | '6m' | '12m' | 'all';

interface ResellerSalesChartProps {
  orders: Order[];
  reseller?: ResellerProfile;
  wallet?: Wallet | null;
}

interface ChartDataPoint {
  key: string;
  label: string;
  fullDate: string;
  sales: number;
  profit: number;
  ordersCount: number;
}

export const ResellerSalesChart: React.FC<ResellerSalesChartProps> = ({
  orders = [],
  reseller,
  wallet,
}) => {
  const { isBn } = useLanguage();
  const [timeRange, setTimeRange] = useState<TimeRange>('14d');
  const [statusFilter, setStatusFilter] = useState<'all' | 'delivered'>('all');
  const [showSales, setShowSales] = useState(true);
  const [showProfit, setShowProfit] = useState(true);
  const [showOrders, setShowOrders] = useState(false);

  // Filter orders by status if requested
  const filteredOrders = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    if (statusFilter === 'delivered') {
      return orders.filter((o) => o.status === 'DELIVERED' || o.status === 'PAID');
    }
    return orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'RETURNED');
  }, [orders, statusFilter]);

  // Aggregate data points based on time range (Daily vs Monthly)
  const { chartData, summary } = useMemo(() => {
    const now = new Date();
    const isMonthly = timeRange === '6m' || timeRange === '12m' || timeRange === 'all';
    const pointMap = new Map<string, ChartDataPoint>();

    if (!isMonthly) {
      // Daily mode (7, 14, 30, 90 days)
      const numDays = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : timeRange === '30d' ? 30 : 90;
      for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;
        
        // Compact label
        const label = numDays > 30 
          ? (i % 7 === 0 || i === 0 ? d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' }) : '')
          : d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short', day: 'numeric' });
        
        const fullDate = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        pointMap.set(key, {
          key,
          label: label || d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }),
          fullDate,
          sales: 0,
          profit: 0,
          ordersCount: 0,
        });
      }

      // Aggregate filtered orders into daily buckets
      filteredOrders.forEach((order) => {
        if (!order.createdAt) return;
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) return;
        const yyyy = orderDate.getFullYear();
        const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
        const dd = String(orderDate.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;

        const profit = order.totalResellerProfit ?? order.resellerProfit ?? 0;
        const sales = order.totalAmount ?? order.subtotal ?? (profit * 3.5);

        if (pointMap.has(key)) {
          const pt = pointMap.get(key)!;
          pt.sales += sales;
          pt.profit += profit;
          pt.ordersCount += 1;
        }
      });
    } else {
      // Monthly mode (6, 12 months, or all time)
      const numMonths = timeRange === '6m' ? 6 : timeRange === '12m' ? 12 : 18;
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const key = `${yyyy}-${mm}`;
        const label = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'short' });
        const fullDate = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' });

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
        if (!order.createdAt) return;
        const orderDate = new Date(order.createdAt);
        if (isNaN(orderDate.getTime())) return;
        const yyyy = orderDate.getFullYear();
        const mm = String(orderDate.getMonth() + 1).padStart(2, '0');
        const key = `${yyyy}-${mm}`;

        const profit = order.totalResellerProfit ?? order.resellerProfit ?? 0;
        const sales = order.totalAmount ?? order.subtotal ?? (profit * 3.5);

        if (pointMap.has(key)) {
          const pt = pointMap.get(key)!;
          pt.sales += sales;
          pt.profit += profit;
          pt.ordersCount += 1;
        }
      });
    }

    const data = Array.from(pointMap.values());

    // Compute period summary
    let totalSales = data.reduce((sum, pt) => sum + pt.sales, 0);
    let totalProfit = data.reduce((sum, pt) => sum + pt.profit, 0);
    let totalOrders = data.reduce((sum, pt) => sum + pt.ordersCount, 0);

    // If viewing All Time and there is lifetime wallet/reseller record higher than bucketed orders, reflect accurate baseline
    if (timeRange === 'all' && totalOrders === 0 && (reseller?.deliveredOrdersCount || 0) > 0) {
      totalProfit = wallet?.totalEarned || reseller?.totalProfitEarned || 0;
      totalSales = (reseller as any)?.totalSalesBdt || Math.round(totalProfit * 3.5);
      totalOrders = reseller?.deliveredOrdersCount || 0;
    }

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
  }, [filteredOrders, timeRange, isBn, reseller, wallet]);

  const timeRangeOptions: { id: TimeRange; labelEn: string; labelBn: string }[] = [
    { id: '7d', labelEn: '7D', labelBn: '৭ দিন' },
    { id: '14d', labelEn: '14D', labelBn: '১৪ দিন' },
    { id: '30d', labelEn: '30D', labelBn: '৩০ দিন' },
    { id: '90d', labelEn: '3M', labelBn: '৩ মাস' },
    { id: '6m', labelEn: '6M', labelBn: '৬ মাস' },
    { id: '12m', labelEn: '1Y', labelBn: '১ বছর' },
    { id: 'all', labelEn: 'All', labelBn: 'সব সময়' },
  ];

  return (
    <div
      className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-6"
      id="reseller-sales-performance-chart"
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-base sm:text-lg text-slate-900">
                  {isBn ? 'বিক্রয় ও মুনাফা পারফরম্যান্স অ্যানালিটিক্স' : 'Sales & Earnings Performance Analytics'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[10px] font-black tracking-wide uppercase">
                  {isBn ? 'লাইভ গ্রাফ' : 'Live Sync'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn
                  ? 'দৈনিক ও মাসিক গ্রাহক সেলস ভলিউম, রিসেলার মার্জিন আয় ও ডেলিভারি গতিবিধি'
                  : 'Track gross turnover, net reseller margins, and delivery velocity across custom windows'}
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
              className={`px-3 py-1.5 rounded-lg transition text-xs ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isBn ? 'সব সচল অর্ডার' : 'All Active'}
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg transition text-xs ${
                statusFilter === 'delivered'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isBn ? 'ডেলিভার্ড শুধুমাত্র' : 'Delivered Only'}
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
            {timeRangeOptions.map((range) => (
              <button
                key={range.id}
                onClick={() => setTimeRange(range.id)}
                className={`px-2.5 py-1.5 rounded-lg transition whitespace-nowrap text-xs ${
                  timeRange === range.id
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {isBn ? range.labelBn : range.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mini KPI Highlights for selected range */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
        <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            {isBn ? 'পিরিয়ড মোট সেলস' : 'Period Sales'}
          </p>
          <p className="text-lg sm:text-xl font-black text-slate-900 font-mono">
            ৳{summary.totalSales.toLocaleString()}
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {isBn ? 'গ্রাহক দ্বারা প্রদেয়' : 'Gross customer total'}
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            {isBn ? 'আপনার প্রফিট আয়' : 'Reseller Profit'}
          </p>
          <p className="text-lg sm:text-xl font-black text-indigo-700 font-mono">
            +৳{summary.totalProfit.toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-600 font-bold">
            {isBn ? '১০০% নিশ্চিত মার্জিন' : '100% net earnings'}
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
            {isBn ? 'পিরিয়ড অর্ডার' : 'Total Orders'}
          </p>
          <p className="text-lg sm:text-xl font-black text-slate-900 font-mono">
            {summary.totalOrders}{' '}
            <span className="text-xs font-normal text-slate-400">
              {isBn ? 'টি অর্ডার' : 'orders'}
            </span>
          </p>
          <p className="text-[10px] text-slate-400 font-medium">
            {isBn ? 'নির্বাচিত সময়ে' : 'In chosen window'}
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            {isBn ? 'গড় লাভ মার্জিন' : 'Avg Profit Margin'}
          </p>
          <p className="text-lg sm:text-xl font-black text-amber-700 font-mono">
            {summary.avgProfitMargin}%
          </p>
          <p className="text-[10px] text-amber-600 font-bold">
            {isBn ? 'পাইকারি ফ্যাক্টরি রেট' : 'Factory wholesale delta'}
          </p>
        </div>
      </div>

      {/* Metric Toggles & Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSales}
              onChange={(e) => setShowSales(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5 font-bold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shadow-xs" />
              {isBn ? 'কাস্টমার সেলস (৳)' : 'Customer Sales (৳)'}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showProfit}
              onChange={(e) => setShowProfit(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 accent-indigo-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5 font-bold text-indigo-800">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block shadow-xs" />
              {isBn ? 'আপনার প্রফিট আয় (৳)' : 'Your Profit (৳)'}
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showOrders}
              onChange={(e) => setShowOrders(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 accent-amber-500 cursor-pointer"
            />
            <span className="flex items-center gap-1.5 font-bold text-amber-800">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-xs" />
              {isBn ? 'অর্ডার সংখ্যা' : 'Orders Count'}
            </span>
          </label>
        </div>

        <span className="text-[11px] text-slate-400 font-medium">
          {isBn
            ? `${timeRange === '6m' || timeRange === '12m' || timeRange === 'all' ? 'মাসিক' : 'দৈনিক'} গ্রাফিকাল বিশ্লেষণ`
            : `Showing ${timeRange === '6m' || timeRange === '12m' || timeRange === 'all' ? 'Monthly' : 'Daily'} performance breakdown`}
        </span>
      </div>

      {/* Chart Canvas */}
      <div className="w-full min-w-0 h-[340px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -8, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              dy={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
              tickFormatter={(v) => (v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v}`)}
            />
            {showOrders && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#d97706', fontSize: 11, fontWeight: 500 }}
                allowDecimals={false}
              />
            )}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataPoint;
                  return (
                    <div className="bg-slate-950/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-800 text-xs space-y-2.5 min-w-[210px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-slate-100">{data.fullDate}</span>
                        <span className="bg-slate-800 px-2.5 py-0.5 rounded-full text-[10px] text-amber-300 font-mono font-bold">
                          {data.ordersCount} {isBn ? 'টি অর্ডার' : data.ordersCount === 1 ? 'order' : 'orders'}
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-0.5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {isBn ? 'কাস্টমার সেলস:' : 'Customer Sales:'}
                          </span>
                          <span className="font-black text-emerald-400 font-mono">
                            ৳{data.sales.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" />
                            {isBn ? 'রিসেলার প্রফিট:' : 'Reseller Profit:'}
                          </span>
                          <span className="font-black text-indigo-300 font-mono">
                            +৳{data.profit.toLocaleString()}
                          </span>
                        </div>
                        {data.sales > 0 && (
                          <div className="flex items-center justify-between gap-4 text-[11px] pt-1.5 border-t border-slate-800/80 text-slate-400 font-medium">
                            <span>{isBn ? 'মার্জিন হার:' : 'Profit Margin:'}</span>
                            <span className="font-black text-amber-300">
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
                name={isBn ? 'সেলস (৳)' : 'Sales (৳)'}
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 3.5, fill: '#10b981', strokeWidth: 1.5, stroke: '#fff' }}
                activeDot={{ r: 6.5, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
            {showProfit && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                name={isBn ? 'প্রফিট (৳)' : 'Profit (৳)'}
                stroke="#6366f1"
                strokeWidth={2.5}
                strokeDasharray="4 2"
                dot={{ r: 3.5, fill: '#6366f1', strokeWidth: 1.5, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
            {showOrders && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ordersCount"
                name={isBn ? 'অর্ডার' : 'Orders'}
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5.5, fill: '#f59e0b' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
