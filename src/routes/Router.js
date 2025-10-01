import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/loadable/Loadable';
import { element } from 'prop-types';
import OwnerLoginPage from '../pages/owner/OwnerLoginPage';
import OwnerDashboardPage from '../pages/owner/OwnerDashboardPage';
import EmployeeSetupPage from '../pages/employee/EmployeeSetupPage';
import EmployeeLoginPage from '../pages/employee/EmployeeLoginPage';
import EmployeeDashboardPage from '../pages/employee/EmployeeDashboardPage';
import OwnerProtectedRoute from './OwnerProtectedRoute';
import EmpProtectedRoute from './EmployeeProtectedRoute';
import OwnerTaskPage from '../pages/owner/OwnerTaskPage';
/* ***Layouts**** */
const OwnerLayout = Loadable(lazy(() => import('../layouts/ownerLayout')));
const EmployeeLayout = Loadable(lazy(() => import('../layouts/employeeLayout')));

/* ****Pages***** */
const Router = [

  {
    path: '/owner',
    element: <OwnerLayout />,
    children: [
      { path: 'login', element: <OwnerLoginPage /> },
      {
        element: <OwnerProtectedRoute />,
        children: [
          { path: 'dashboard', element: <OwnerDashboardPage /> },
          { path: 'taskboard', element: <OwnerTaskPage /> },
        ]
      }


    ],
  },
  {
    path: '/employee',
    element: <EmployeeLayout />,
    children: [
      { path: 'setup', element: <EmployeeSetupPage /> },
      { path: 'login', element: <EmployeeLoginPage /> },
      // {path: 'dashboard', element: <EmployeeDashboardPage />}
      {
        element: <EmpProtectedRoute />, children: [
          { path: 'dashboard', element: <EmployeeDashboardPage /> }
        ]
      }


    ],
  },


];

export default Router;