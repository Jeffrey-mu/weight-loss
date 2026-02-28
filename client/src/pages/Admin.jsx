import { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { RefreshCw, Search, Shield, Trash2, Users } from 'lucide-react';
import request from '../utils/request';

const Admin = () => {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const fetchOverview = useCallback(async () => {
    const res = await request.get('/admin/overview');
    setOverview(res.data);
  }, []);

  const fetchUsers = useCallback(async (q) => {
    const res = await request.get('/admin/users', { params: q ? { q } : undefined });
    setUsers(res.data);
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([fetchOverview(), fetchUsers(query.trim())]);
    } catch (err) {
      if (err?.response?.status === 403) {
        setError('没有后台权限');
      } else {
        setError('加载失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  }, [fetchOverview, fetchUsers, query]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetchUsers(query.trim());
    } catch (err) {
      setError('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const ok = window.confirm('确认删除该用户？该用户的体重/饮食/运动记录将一并删除。');
    if (!ok) return;
    setLoading(true);
    setError('');
    try {
      await request.delete(`/admin/users/${userId}`);
      await Promise.all([fetchOverview(), fetchUsers(query.trim())]);
    } catch (err) {
      if (err?.response?.data?.message) setError(err.response.data.message);
      else setError('删除失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? '设为管理员' : '取消管理员';
    const ok = window.confirm(`确认将用户 ${user.nickname || user.email || user.phone} ${action}？`);
    if (!ok) return;

    setLoading(true);
    setError('');
    try {
      await request.patch(`/admin/users/${user.id}/role`, { role: newRole });
      await fetchUsers(query.trim());
    } catch (err) {
      if (err?.response?.data?.message) setError(err.response.data.message);
      else setError('操作失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    return [
      { label: '用户数', value: overview?.userCount ?? '--', icon: Users, color: 'blue' },
      { label: '体重记录', value: overview?.recordCount?.weight ?? '--', icon: Shield, color: 'blue' },
      { label: '饮食记录', value: overview?.recordCount?.diet ?? '--', icon: Shield, color: 'green' },
      { label: '运动记录', value: overview?.recordCount?.exercise ?? '--', icon: Shield, color: 'orange' },
    ];
  }, [overview]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-purple-600" size={22} />
            后台管理
          </h2>
          <p className="text-sm text-gray-500 mt-1">用户与数据概览</p>
        </div>
        <button
          type="button"
          onClick={refreshAll}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          刷新
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          const colorClass =
            m.color === 'green'
              ? 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white'
              : m.color === 'orange'
                ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white';

          return (
            <div
              key={m.label}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-gray-500 font-medium text-sm mb-1">{m.label}</h3>
                <p className="text-3xl font-bold text-gray-900">{m.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${colorClass}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="text-purple-600" size={20} />
              用户列表
            </h3>
            <p className="text-sm text-gray-500 mt-1">支持按邮箱/手机号/昵称搜索</p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索用户..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              搜索
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">账号</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">昵称</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">记录数</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.length ? (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {u.email || u.phone || '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role === 'admin' ? '管理员' : '普通用户'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.nickname || '--'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                          体重 {u._count?.weightRecords ?? 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-green-50 text-green-700 text-xs font-semibold">
                          饮食 {u._count?.dietRecords ?? 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-orange-50 text-orange-700 text-xs font-semibold">
                          运动 {u._count?.exerciseRecords ?? 0}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {u.createdAt ? format(new Date(u.createdAt), 'yyyy-MM-dd HH:mm') : '--'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleRole(u)}
                        className="mr-2 inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        disabled={loading}
                        title={u.role === 'admin' ? '取消管理员' : '设为管理员'}
                      >
                        <Shield size={16} />
                        {u.role === 'admin' ? '降级' : '提权'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        disabled={loading}
                        title="删除用户"
                      >
                        <Trash2 size={16} />
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    {loading ? '加载中...' : '暂无数据'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
