import React, { Profiler } from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Container, Box, } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutEmployee } from '../redux/slices/authSlice';

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutEmployee());
    navigate('/employee/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Employee Board
          </Typography>
          <Box component="nav">
            <Button
              color="inherit"
              component={RouterLink}
              to="/employee/dashboard"
              sx={{ marginRight: 2 }}
            >
              Task List
            </Button>
          </Box>
        
          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container component="main" sx={{ mt: 4, p: 2 }}>
        {/* Các trang con của Employee sẽ được render ở đây */}
      
        <Outlet />
      </Container>
    </Box>
  );
};

export default EmployeeLayout;