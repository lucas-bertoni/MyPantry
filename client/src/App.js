import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import EventLogs from "./components/EventLogs";
import Share from "./components/Share";
import Pantry from "./components/Pantry";
import Table from "./components/Table";
import Recipes from "./components/Recipes";
const App = () => {
    return (React.createElement(Routes, null,
        React.createElement(Route, { path: "/login", element: React.createElement(Login, null) }),
        React.createElement(Route, { path: "/logout", element: React.createElement(Logout, null) }),
        React.createElement(Route, { path: "/register", element: React.createElement(Register, null) }),
        React.createElement(Route, { path: "/eventlogs", element: React.createElement(EventLogs, null) }),
        React.createElement(Route, { path: "/pantries", element: React.createElement(Pantry, null) }),
        React.createElement(Route, { path: "/pantry/:pantry_id", element: React.createElement(Table, null) }),
        React.createElement(Route, { path: "/recipes", element: React.createElement(Recipes, null) }),
        React.createElement(Route, { path: "/share", element: React.createElement(Share, null) }),
        React.createElement(Route, { path: "*", element: React.createElement(Pantry, null) })));
};
export default App;
