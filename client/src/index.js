import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { EthProvider } from "./contexts/EthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import NFTDetail from "./pages/NFTDetail";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/detail" element={<NFTDetail />} />
        </Routes>
      </BrowserRouter>,
    </EthProvider>
  </React.StrictMode>
);
