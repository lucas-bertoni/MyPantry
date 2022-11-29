import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Home from './components/Home';
import EventLogs from './components/EventLogs';

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/logout' element={<Logout />} />
      <Route path='/register' element={<Register />} />
      <Route path='/home' element={<Home />} />
      <Route path='/eventlogs' element={<EventLogs />} />
      <Route path='*' element={<Home />} />
    </Routes>
  )
}

export default App