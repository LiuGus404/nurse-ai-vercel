import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import KneeBraceVideo from './KneeBraceVideo';
import AfoVideo from './AfoVideo';
import UsageGuide from './pages/UsageGuide';
import ChatPage from './pages/ChatPage';
import Layout from './Layout';
import TutorialVideos from './pages/TutorialVideos';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/videos" element={<TutorialVideos />} />
          <Route path="/knee-brace-video" element={<KneeBraceVideo />} />
          <Route path="/afo-video" element={<AfoVideo />} />
          <Route path="/guide" element={<UsageGuide />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </React.StrictMode>
);