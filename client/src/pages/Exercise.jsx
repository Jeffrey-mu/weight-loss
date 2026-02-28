import { useState, useEffect } from 'react';
import request from '../utils/request';
import { format } from 'date-fns';
import { Activity, Flame, Clock, Trash2, Calendar, PlusCircle, Dumbbell } from 'lucide-react';

const Exercise = () => {
  const [exerciseRecords, setExerciseRecords] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    fetchExerciseRecords();
  }, [date]);

  const fetchExerciseRecords = async () => {
    try {
      const res = await request.get(`/exercise?date=${date}`);
      setExerciseRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const exerciseTypeMap = {
    running: '跑步',
    walking: '步行',
    swimming: '游泳',
    cycling: '骑行',
    yoga: '瑜伽',
    weightlifting: '举重',
    other: '其他'
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      await request.post('/exercise', {
        date,
        type,
        duration,
        calories,
      });
      setDuration('');
      setCalories('');
      fetchExerciseRecords();
    } catch (err) {
      console.error(err);
      alert('添加运动记录失败');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('确定要删除这条记录吗？')) {
      try {
        await request.delete(`/exercise/${id}`);
        fetchExerciseRecords();
      } catch (err) {
        console.error(err);
        alert('删除记录失败');
      }
    }
  };

  const totalCalories = exerciseRecords.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-orange-500" />
          运动记录
        </h2>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
          <Calendar size={16} className="text-gray-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600 p-0"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-orange-100 font-medium mb-1">今日运动消耗</p>
          <p className="text-4xl font-bold">{totalCalories} <span className="text-xl font-normal text-orange-100">千卡</span></p>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
          <Flame size={32} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Exercise Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1 h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
            <PlusCircle size={20} className="text-orange-500" />
            添加运动
          </h3>
          <form onSubmit={handleAddExercise} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">运动类型</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(exerciseTypeMap).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-2 rounded-lg text-sm font-medium transition-all truncate ${
                      type === t 
                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-500' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {exerciseTypeMap[t]}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">时长 (分钟)</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">消耗热量 (千卡)</label>
              <div className="relative">
                <Flame className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="0"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-md shadow-orange-500/20 mt-2"
            >
              添加记录
            </button>
          </form>
        </div>

        {/* Exercise List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Dumbbell size={20} className="text-orange-500" />
              今日运动列表
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">时长</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">热量</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {exerciseRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Dumbbell size={48} className="text-gray-200" />
                        <p>今天还没有运动记录，动起来吧！</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  exerciseRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(record.createdAt), 'HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {exerciseTypeMap[record.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {record.duration} 分钟
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">
                        +{record.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(record.id)} 
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
