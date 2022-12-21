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
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/eventlogs" element={<EventLogs />} />
      <Route path="/pantries" element={<Pantry />} />
      <Route path="/pantry/:pantry_id" element={<Table />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/share" element={<Share />} />
      <Route path="*" element={<Pantry />} />
    </Routes>
  );
};

export default App;
