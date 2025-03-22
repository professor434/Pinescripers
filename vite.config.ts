import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import DevPanel from '../components/DevPanel';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DevPanel />} />
    </Routes>
  );
};

export default App;
