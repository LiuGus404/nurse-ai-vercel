import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import KneeBraceVideo from './KneeBraceVideo';
import AfoVideo from './AfoVideo';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/knee-brace-video" element={<KneeBraceVideo />} />
        <Route path="/afo-video" element={<AfoVideo />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);