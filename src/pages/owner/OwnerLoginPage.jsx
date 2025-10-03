import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ownerApi from '@api/OwnerApi.js';
import { useDispatch } from 'react-redux';
import { setOwnerCredentials } from '../../redux/slices/authSlice';
import { Box, Button, TextField } from '@mui/material';
const OwnerLoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1); // 1: Nhập SĐT, 2: Nhập mã
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGetAccessCode = async (e) => {
    e.preventDefault();
    try {
      const result = await ownerApi.post('/owners/send-code', { phoneNumber });
      console.log(result);
      alert('Access code is sent to your phonenumber.');
      setStep(2);
    } catch (error) {
      alert(`${error.response.data.message}`);
      console.error(error);
    }
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    try {
      const response = await ownerApi.post('/owners/login', { phoneNumber, accessCode });
      console.log(response);
      if (response.status == 200) {
        alert("Login success fully");
        const accessToken = response.data.accessToken;
        localStorage.setItem("ownerPhone", phoneNumber);
        dispatch(setOwnerCredentials({
          accessToken: accessToken,
          phoneNumber: phoneNumber,
        }));
        navigate('/owner/dashboard');
      }
    } catch (error) {
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Owner Login</h1>
      {step === 1 && (
        <Box
          component="form"
          onSubmit={handleGetAccessCode}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            margin: "auto",
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <TextField
            type="tel"
            label="Phone Number"
            variant="outlined"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Receive access code
          </Button>
        </Box>
      )}

      {step === 2 && (
          <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 400,
            margin: "auto",
            mt: 5,
            p: 3,
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <TextField
            type="tel"
            label="Access Code"
            variant="outlined"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Sign In
          </Button>
        </Box>
      )}
    </div>
  );
};

export default OwnerLoginPage;