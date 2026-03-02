import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  BarChart2, 
  Utensils, 
  Dumbbell, 
  Smartphone, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />,
      title: "智能数据追踪",
      description: "自动生成体重趋势图表，可视化您的减脂进程，让每一个进步都清晰可见。"
    },
    {
      icon: <Utensils className="w-6 h-6 text-green-600" />,
      title: "饮食热量管理",
      description: "轻松记录每一餐，内置常见食物热量库，精准掌控每日热量摄入。"
    },
    {
      icon: <Dumbbell className="w-6 h-6 text-orange-600" />,
      title: "运动消耗统计",
      description: "支持多种运动类型记录，自动计算消耗热量，科学规划运动计划。"
    },
    {
      icon: <Smartphone className="w-6 h-6 text-purple-600" />,
      title: "全平台支持",
      description: "随时随地记录数据，手机、平板、电脑多端同步，数据永不丢失。"
    }
  ];

  const testimonials = [
    {
      content: "使用这款应用3个月，我成功减掉了10公斤！界面简洁，功能强大，是我用过最好的减脂工具。",
      author: "李明",
      role: "健身爱好者"
    },
    {
      content: "数据可视化功能太棒了，看着曲线一点点下降真的很有成就感，强烈推荐给正在减肥的朋友。",
      author: "张薇",
      role: "上班族"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <BarChart2 size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">减脂追踪</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">功能特性</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">用户评价</a>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">登录</Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
                免费注册
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>功能特性</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600" onClick={() => setIsMenuOpen(false)}>用户评价</a>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setIsMenuOpen(false)}>登录</Link>
              <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-center font-medium" onClick={() => setIsMenuOpen(false)}>
                免费注册
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            科学记录，<span className="text-blue-600">轻松减脂</span>
            <br />
            遇见更好的自己
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            告别盲目节食，用数据掌控身材。全方位的体重、饮食、运动追踪工具，
            助您科学高效地达成减脂目标。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
              立即开始记录
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a href="#features" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200">
              了解更多
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              专为减脂人群设计，简单易用，功能强大，让坚持变得更容易。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-y border-gray-100 py-12">
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">10,000+</p>
              <p className="text-gray-600">活跃用户</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">50,000kg</p>
              <p className="text-gray-600">累计减重</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
              <p className="text-gray-600">好评率</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">用户真实反馈</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="text-yellow-400">★</div>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic">“{item.content}”</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {item.author[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{item.author}</p>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好开始改变了吗？
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            立即加入我们，开启您的科学减脂之旅。完全免费，随时随地记录。
          </p>
          <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-blue-600 bg-white hover:bg-blue-50 transition-all shadow-lg">
            免费注册账号
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                  <BarChart2 size={20} />
                </div>
                <span className="text-xl font-bold text-white">减脂追踪</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                致力于帮助用户通过科学的数据记录和分析，实现健康减脂目标，拥抱更好的生活方式。
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">产品</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">功能特性</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">用户案例</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">注册账号</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">关于</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系方式</a></li>
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © {new Date().getFullYear()} 减脂追踪. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
