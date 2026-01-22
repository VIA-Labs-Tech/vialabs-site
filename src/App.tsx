import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { Platform } from './pages/Platform';
import { UseCases } from './pages/UseCases';

// ScrollToTop component to reset scroll on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="overview" element={<Platform />} />
          <Route path="use-cases" element={<UseCases />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
