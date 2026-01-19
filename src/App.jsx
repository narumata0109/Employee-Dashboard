import { useState } from 'react';
import './App.css'
import Login from './pages/login';
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import EmployeeTable from "./pages/employeeTable.jsx";
import UpsertEmployee from './pages/upsertEmployee.jsx';
import ProtectedRoute from "./protectedRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard/*" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> }/>
      <Route path="all-employee" element={ <ProtectedRoute><EmployeeTable /></ProtectedRoute>} />
      <Route path="add-employee" element={<ProtectedRoute><UpsertEmployee /></ProtectedRoute>} />
      <Route path="employee/:id" element={<ProtectedRoute><UpsertEmployee /></ProtectedRoute>} />
      <Route path="*" element={<Login />} />
    </Routes>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>  
  )
}

export default App
