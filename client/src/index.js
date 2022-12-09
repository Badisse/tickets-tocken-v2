import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { EthProvider } from "./contexts/EthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Explore from "./pages/Explore";
import NFTDetail from "./pages/NFTDetail";
import Dashboard from './pages/Dashboard';
import Staking from "./pages/Staking"
import Admin from "./pages/Admin"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/detail" element={<NFTDetail />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </BrowserRouter>,
    </EthProvider>
  </React.StrictMode>
);
