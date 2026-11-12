import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';

// heavier pages load on demand (WikiPage pulls in react-markdown)
const Sandbox = lazy(() => import('./pages/Sandbox'));
const Guides = lazy(() => import('./pages/Guides'));
const WikiPage = lazy(() => import('./pages/WikiPage'));
const WikiIndex = lazy(() => import('./pages/WikiIndex'));
const Roadmap = lazy(() => import('./pages/Roadmap'));

const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
    <h1>Page not found</h1>
    <Link to="/">Back to home</Link>
  </div>
);

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Suspense fallback={<p style={{ padding: '2rem' }}>Loading…</p>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<MapPage />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="guides" element={<Guides />} />
          <Route path="wiki" element={<WikiIndex />} />
          <Route path="wiki/:pipelineId" element={<WikiPage />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
