import { useState, useEffect } from 'react';
import request from '../utils/request';
import { format } from 'date-fns';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Scale, Utensils, Flame, Plus, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [weightRecords, setWeightRecords] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [note, setNote] = useState('');
  const [stats, setStats] = useState({ weight: null, totalIntake: 0, totalBurned: 0 });

  useEffect(() => {
    fetchWeightRecords();
    fetchStats();
  }, []);

  const fetchWeightRecords = async () => {
    try {
      const res = await request.get('/weight');
      setWeightRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await request.get('/stats/today');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();
    try {
      await request.post('/weight', {
        date: new Date(),
        weight: newWeight,
        note,
      });
      setNewWeight('');
      setNote('');
      fetchWeightRecords();
      fetchStats();
    } catch (err) {
      console.error(err);
      alert('添加体重记录失败');
    }
  };

  const chartData = weightRecords
    .slice()
    .reverse()
    .map((record) => ({
      date: format(new Date(record.date), 'MM-dd'),
      weight: record.weight,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">仪表盘</h2>
        <span className="text-sm text-gray-500">{format(new Date(), 'yyyy年MM月dd日')}</span>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="relative z-10">
            <h3 className="text-gray-500 font-medium text-sm mb-1">今日体重</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.weight ? `${stats.weight}` : '--'} <span className="text-sm text-gray-400 font-normal">kg</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Scale size={24} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">今日摄入</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalIntake} <span className="text-sm text-gray-400 font-normal">千卡</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Utensils size={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-gray-500 font-medium text-sm mb-1">今日消耗</h3>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalBurned} <span className="text-sm text-gray-400 font-normal">千卡</span>
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Flame size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} />
              体重趋势
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 1', 'dataMax + 1']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#9ca3af', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Add Weight Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="text-blue-500" size={20} />
            记录体重
          </h2>
          <form onSubmit={handleAddWeight} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">体重 (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="0.0"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">备注 (选填)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="今天感觉如何..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              添加记录
            </button>
          </form>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-500" size={20} />
            近期记录
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">日期</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">体重</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">备注</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {weightRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(record.date), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.weight} <span className="text-gray-400 font-normal">kg</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
