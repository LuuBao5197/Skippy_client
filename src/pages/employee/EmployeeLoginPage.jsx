import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// MUI Components
import {
  Avatar, Button, TextField, Link, Grid, Box, Typography, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, IconButton
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// Your existing imports
import employeeApi from '@api/EmployeeApi.js';
import { setEmployeeCredentials } from '../../redux/slices/authSlice';

const EmployeeLoginPage = () => {
  const [showPass, setShowPass] = useState(false);
  // login state 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // forgot password state
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openFMRPassDialog, setOpenFMRPassDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await employeeApi.post('/emps/login', { username, password });
      dispatch(setEmployeeCredentials({
        token: response.data.accessToken,
        employee: response.data.employee,
      }));
      navigate('/employee/dashboard');
    } catch (error) {
      alert('Error: Username or password is not correct.');
      console.error(error);
    }
  };

  const handleClickShowPassword = () => setShowPass((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // --- LOGIC FOR POPUP FORGOT PASSWORD ---
  const handleOpenForgotDialog = () => {
    setOpenForgotDialog(true);
  };

  const handleCloseForgotDialog = () => {
    setOpenForgotDialog(false);
  };
  const handleForgotPasswordSubmit = async (e) => {
    console.log('Gửi yêu cầu reset mật khẩu cho email:', email);
    e.preventDefault();
    try {
      const response = await employeeApi.post('/emps/getOtpFGPass', { email });
      if (response.status == "200") {
        handleCloseForgotDialog();
        setOpenSuccessDialog(true);
      } else {
        throw new Error("Invalid email");
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
      console.error(error);
    }

  };
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
  };

  const handleValidOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await employeeApi.post('/emps/validOtpFGPass', { otp });
      if (response.status == "200") {
        setTimeout(() => {
          handleCloseSuccessDialog();
        }, 1000);
        setTimeout(() => {
          handleOpenFMRSPassWordDialog();
        }, 1000);
      } else {
        throw new Error("Invalid otp");
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
      console.error(error);
    }
  }
  const handleOpenFMRSPassWordDialog = () => {
    setOpenFMRPassDialog(true);
  }
  const handleCloseFMRSPassWordDialog = () => {
    setOpenFMRPassDialog(false)
  }
  const handleResetPass = async (e) => {
    e.preventDefault();
    try {
      const response = await employeeApi.post('/emps/resetPass', {otp, newPassword });
      if (response.status == "200") {
         setTimeout(() => {
           handleCloseFMRSPassWordDialog();
           alert("Change password success fully, please sign in agains");
        }, 1000);
        navigate('/employee/login');
        
      } else {
        throw new Error("Invalid password");
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
      console.error(error);
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login Employee
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Enter a username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            id="password"
            autoComplete="current-password"
            // Change type by state
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {/* Change icon by state */}
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" onClick={handleOpenForgotDialog}>
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Popup 1: Enter email to reset password */}
      <Dialog open={openForgotDialog} onClose={handleCloseForgotDialog}>
        <DialogTitle>Forgot password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your email address. We sent a link have otp to your email to set new password.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Adress"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)} s
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotDialog}>Cancel</Button>
          <Button onClick={handleForgotPasswordSubmit}>Send</Button>
        </DialogActions>
      </Dialog>

      {/* Popup 2: Notification enter OTP */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter OTP
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="otp"
            label="otp"
            type="text"
            fullWidth
            variant="standard"
            value={otp}
            required
            onChange={(e) => setOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog}>Close</Button>
        </DialogActions>
        <Button onClick={handleValidOtp}>Send</Button>
      </Dialog>


      {/* Popup 3: Form reset password */}
      <Dialog open={openFMRPassDialog} onClose={handleCloseFMRSPassWordDialog}>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter new Password
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="newPassword"
            label="newPassword"
            type="text"
            fullWidth
            variant="standard"
            value={newPassword}
            required
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFMRSPassWordDialog}>Close</Button>
        </DialogActions>
        <Button onClick={handleResetPass}>Send</Button>
      </Dialog>
    </Container>
  );
};

export default EmployeeLoginPage;