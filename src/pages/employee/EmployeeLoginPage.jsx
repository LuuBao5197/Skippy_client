import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// MUI Components
import {
  Avatar, Button, TextField, Link, Grid, Box, Typography, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,InputAdornment, IconButton
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
  const [email, setEmail] = useState('');

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
      alert('Lỗi: Tên đăng nhập hoặc mật khẩu không đúng.');
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
  const handleForgotPasswordSubmit = () => {
    console.log('Gửi yêu cầu reset mật khẩu cho email:', email);

    handleCloseForgotDialog();
    setOpenSuccessDialog(true);
  };

  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
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
        <DialogTitle>Quên mật khẩu</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Địa chỉ Email"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotDialog}>Hủy</Button>
          <Button onClick={handleForgotPasswordSubmit}>Gửi</Button>
        </DialogActions>
      </Dialog>

      {/* Popup 2: Notification send email success */}
      <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Yêu cầu đã được gửi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Nếu email của bạn tồn tại trong hệ thống, chúng tôi đã gửi một liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeLoginPage;