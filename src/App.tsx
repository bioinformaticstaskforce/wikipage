import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import MapPage from './pages/MapPage';
import Sandbox from './pages/Sandbox';
import Guides from './pages/Guides';
import WikiPage from './pages/WikiPage';
import WikiIndex from './pages/WikiIndex';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<MapPage />} />
          <Route path="sandbox" element={<Sandbox />} />
          <Route path="guides" element={<Guides />} />
          <Route path="wiki" element={<WikiIndex />} />
          <Route path="wiki/:pipelineId" element={<WikiPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
