import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import KneeBraceVideo from './KneeBraceVideo';
import AfoVideo from './AfoVideo';
import GuidePage from './pages/guide'; // 新增引入
import Layout from './layout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/videos" element={<KneeBraceVideo />} />
          <Route path="/afo-video" element={<AfoVideo />} />
          <Route path="/guide" element={<GuidePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);