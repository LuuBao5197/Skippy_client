import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const EmpProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.employee?.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/employee/login" replace />;
  }
  return <Outlet />;
};

export default EmpProtectedRoute;