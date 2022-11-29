import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Home from './components/Home';
import EventLogs from './components/EventLogs';
const App = () => {
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: '/login', element: React.createElement(Login, null) }),
        React.createElement(Route, { path: '/logout', element: React.createElement(Logout, null) }),
        React.createElement(Route, { path: '/register', element: React.createElement(Register, null) }),
        React.createElement(Route, { path: '/home', element: React.createElement(Home, null) }),
        React.createElement(Route, { path: '/eventlogs', element: React.createElement(EventLogs, null) }),
        React.createElement(Route, { path: '*', element: React.createElement(Home, null) })));
};
export default App;
