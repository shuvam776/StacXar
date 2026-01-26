import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import './styles/global.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Dashboard Placeholder */}
        <Route path="/dashboard" element={<div className="full-screen flex items-center justify-center"><h1>Dashboard Coming Soon</h1></div>} />
      </Routes>
    </Router>
  );
}

export default App;
