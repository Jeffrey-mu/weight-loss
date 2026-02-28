import { useState, useEffect, useCallback } from 'react';
import request from '../utils/request';
import { format } from 'date-fns';
import { Utensils, Plus, Calendar, Trash2, Clock, Flame } from 'lucide-react';

const Diet = () => {
  const [dietRecords, setDietRecords] = useState([]);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [amount, setAmount] = useState('');
  const [calories, setCalories] = useState('');

  const fetchDietRecords = useCallback(async () => {
    try {
      const res = await request.get(`/diet?date=${date}`);
      setDietRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [date]);

  useEffect(() => {
    fetchDietRecords();
  }, [fetchDietRecords]);

  const typeMap = {
    breakfast: '早餐',
    lunch: '午餐',
    dinner: '晚餐',
    snack: '加餐'
  };

  const handleAddDiet = async (e) => {
    e.preventDefault();
    try {
      await request.post('/diet', {
        date,
        type,
        foodName,
        amount,
        calories,
      });
      setFoodName('');
      setAmount('');
      setCalories('');
      fetchDietRecords();
    } catch (err) {
      console.error(err);
      alert('添加饮食记录失败');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('确定要删除这条记录吗？')) {
      try {
        await request.delete(`/diet/${id}`);
        fetchDietRecords();
      } catch (err) {
        console.error(err);
        alert('删除记录失败');
      }
    }
  };

  const totalCalories = dietRecords.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Utensils className="text-green-600" size={28} />
            饮食记录
          </h2>
          <p className="text-gray-500 text-sm mt-1">记录每一餐，掌控热量摄入</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
          <Calendar size={20} className="text-gray-500 ml-2" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-none focus:ring-0 text-gray-700 font-medium bg-transparent"
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-green-100 font-medium mb-1">今日总摄入</p>
          <p className="text-4xl font-bold">{totalCalories} <span className="text-xl font-normal text-green-100">千卡</span></p>
        </div>
        <div className="bg-white/20 p-4 rounded-full">
          <Flame size={32} className="text-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Diet Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus className="text-green-600" size={20} />
            添加食物
          </h3>
          <form onSubmit={handleAddDiet} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">餐点类型</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(typeMap).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      type === t 
                        ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {typeMap[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">食物名称</label>
              <input
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="例如：燕麦牛奶"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">数量 (g/ml)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="200"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">热量 (千卡)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="150"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-700 active:scale-[0.98] transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 mt-2"
            >
              <Plus size={20} />
              添加记录
            </button>
          </form>
        </div>

        {/* Diet List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-2 flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Utensils className="text-green-600" size={20} />
              今日菜单
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">时间</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">食物</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">热量</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {dietRecords.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Utensils size={48} className="text-gray-200" />
                        <p>该日期暂无饮食记录</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dietRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {format(new Date(record.createdAt), 'HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          record.type === 'breakfast' ? 'bg-orange-100 text-orange-700' :
                          record.type === 'lunch' ? 'bg-red-100 text-red-700' :
                          record.type === 'dinner' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {typeMap[record.type]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {record.foodName} 
                        {record.amount && <span className="text-gray-400 text-xs font-normal ml-1">({record.amount}g)</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        +{record.calories}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDelete(record.id)} 
                          className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                          title="删除"
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

export default Diet;
