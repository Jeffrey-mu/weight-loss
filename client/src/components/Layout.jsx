import { useContext } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Utensils, Dumbbell, LogOut, Shield, User } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'text-blue-600 bg-blue-50' 
      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50';
  };

  const mobileIsActive = (path) => {
    return location.pathname === path 
      ? 'text-blue-600' 
      : 'text-gray-400 hover:text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 hidden md:block sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 mr-10">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <LayoutDashboard size={20} />
                </div>
                减脂追踪
              </Link>
              <div className="flex space-x-4">
                <Link to="/" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/')}`}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  仪表盘
                </Link>
                <Link to="/diet" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/diet')}`}>
                  <Utensils className="w-4 h-4 mr-2" />
                  饮食记录
                </Link>
                <Link to="/exercise" className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/exercise')}`}>
                  <Dumbbell className="w-4 h-4 mr-2" />
                  运动记录
                </Link>
                {user?.isAdmin ? (
                  <Link
                    to="/admin"
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive('/admin')}`}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    后台管理
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 mr-2 text-gray-500" />
                <span className="font-medium">{user?.nickname || user?.email || user?.phone}</span>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
                title="退出登录"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-6">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileIsActive('/')}`}>
            <LayoutDashboard size={24} strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-xs font-medium">仪表盘</span>
          </Link>
          <Link to="/diet" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileIsActive('/diet')}`}>
            <Utensils size={24} strokeWidth={location.pathname === '/diet' ? 2.5 : 2} />
            <span className="text-xs font-medium">饮食</span>
          </Link>
          <Link to="/exercise" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileIsActive('/exercise')}`}>
            <Dumbbell size={24} strokeWidth={location.pathname === '/exercise' ? 2.5 : 2} />
            <span className="text-xs font-medium">运动</span>
          </Link>
          {user?.isAdmin ? (
            <Link to="/admin" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${mobileIsActive('/admin')}`}>
              <Shield size={24} strokeWidth={location.pathname === '/admin' ? 2.5 : 2} />
              <span className="text-xs font-medium">后台</span>
            </Link>
          ) : null}
          <button 
            onClick={logout} 
            className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-400 hover:text-red-500"
          >
            <LogOut size={24} />
            <span className="text-xs font-medium">退出</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;
