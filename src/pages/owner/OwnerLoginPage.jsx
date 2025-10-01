import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ownerApi from '@api/OwnerApi.js';
import { useDispatch } from 'react-redux';
import { setOwnerCredentials } from '../../redux/slices/authSlice';
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
      alert('Mã truy cập đã được gửi đến số điện thoại của bạn.');
      setStep(2);
    } catch (error) {
      alert(`Lỗi: Không thể gửi mã truy cập. ${error}`);
      console.error(error);
    }
  };

  const handleLogin = async (e) => {
 
    e.preventDefault();
    try {
      const response = await ownerApi.post('/owners/login', { phoneNumber, accessCode });
      console.log(response);
      if (response.status == 200) {
        // Lưu lại trạng thái đăng nhập, ví dụ: lưu token hoặc sđt
        alert("Login success fully");
        const accessToken = response.data.accessToken;
        localStorage.setItem("ownerPhone",phoneNumber);
        dispatch(setOwnerCredentials({
          accessToken: accessToken,
          phoneNumber: phoneNumber,
        }));
        console.log(response.data);
        navigate('/owner/dashboard');
      }
    } catch (error) {
      alert('Lỗi: Mã truy cập không hợp lệ.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Owner Login</h1>
      {step === 1 && (
        <form onSubmit={handleGetAccessCode}>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Số điện thoại"
            required
          />
          <button type="submit">Nhận mã truy cập</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            placeholder="Mã truy cập 6 số"
            required
          />
          <button type="submit">Đăng nhập</button>
        </form>
      )}
    </div>
  );
};

export default OwnerLoginPage;