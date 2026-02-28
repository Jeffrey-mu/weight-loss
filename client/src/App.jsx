import { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Diet from './pages/Diet';
import Exercise from './pages/Exercise';
import Layout from './components/Layout';

const upsertMetaTag = ({ name, property, content }) => {
  const selector = name
    ? `meta[name="${name}"]`
    : property
      ? `meta[property="${property}"]`
      : null;

  if (!selector) return;

  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (name) el.setAttribute('name', name);
    if (property) el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const SeoManager = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    const defaults = {
      title: '减肥记录 - 体重饮食运动管理',
      description: '减肥记录工具：记录体重、饮食与运动数据，查看趋势与统计，帮助你科学减脂与坚持打卡。',
      robots: 'index,follow',
    };

    const routeMeta = {
      '/': {
        title: '仪表盘 - 减肥记录',
        description: '查看今日体重、热量摄入与消耗，并追踪体重趋势。',
        robots: 'noindex,nofollow',
      },
      '/diet': {
        title: '饮食记录 - 减肥记录',
        description: '记录每一餐的食物与热量，统计当日总摄入。',
        robots: 'noindex,nofollow',
      },
      '/exercise': {
        title: '运动记录 - 减肥记录',
        description: '记录运动类型、时长与消耗热量，统计当日总消耗。',
        robots: 'noindex,nofollow',
      },
      '/login': {
        title: '登录 - 减肥记录',
        description: '登录后开始记录体重、饮食与运动数据。',
        robots: 'index,follow',
      },
      '/register': {
        title: '注册 - 减肥记录',
        description: '创建账号，开始你的减脂记录之旅。',
        robots: 'index,follow',
      },
    };

    const meta = routeMeta[path] || defaults;

    document.title = meta.title;
    upsertMetaTag({ name: 'description', content: meta.description });
    upsertMetaTag({ name: 'robots', content: meta.robots });

    upsertMetaTag({ property: 'og:title', content: meta.title });
    upsertMetaTag({ property: 'og:description', content: meta.description });
    upsertMetaTag({ name: 'twitter:title', content: meta.title });
    upsertMetaTag({ name: 'twitter:description', content: meta.description });
  }, [location.pathname]);

  return null;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>加载中...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <SeoManager />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="diet" element={<Diet />} />
            <Route path="exercise" element={<Exercise />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
