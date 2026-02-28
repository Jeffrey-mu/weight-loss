import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Smartphone } from 'lucide-react';

const Register = () => {
  const [registerType, setRegisterType] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(
        registerType === 'email' ? email : '',
        registerType === 'phone' ? phone : '',
        password,
        nickname
      );
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('注册失败，请检查输入信息');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-500">
            <UserPlus size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">创建新账号</h2>
          <p className="text-gray-500 text-sm mt-1">请填写以下信息以完成注册</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Register Type Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRegisterType('email')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                registerType === 'email'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              邮箱注册
            </button>
            <button
              type="button"
              onClick={() => setRegisterType('phone')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                registerType === 'phone'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              手机号注册
            </button>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">昵称</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="您的昵称"
                required
              />
            </div>
          </div>
          
          {registerType === 'email' ? (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1.5">手机号</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                  placeholder="请输入手机号"
                  required
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1.5">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all shadow-md shadow-green-500/20"
          >
            注册
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-500">
          已有账号？ <Link to="/login" className="text-green-600 font-medium hover:underline">去登录</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
