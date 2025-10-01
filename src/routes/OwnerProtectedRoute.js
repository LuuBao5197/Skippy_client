import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const OwnerProtectedRoute = () => {
  
  const isAuthenticated = useSelector((state) => state.auth.owner?.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }
  return <Outlet />;
};

export default OwnerProtectedRoute;