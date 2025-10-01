import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import employeeApi from '@api/EmployeeApi.js';

const EmployeeSetupPage = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token'); // Lấy token từ URL: ?token=...
  console.log('Token từ URL:', token);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Token không hợp lệ.');
      return;
    }
    try {
      const result = await employeeApi.post('/emps/setupAccount', { username, password, setupToken: token });
      console.log("result: ", result);
      alert('Thiết lập tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/employee/login');
    } catch (error) {
      alert(`Lỗi: Không thể thiết lập tài khoản. ${error.response.data.message}`);
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Thiết lập tài khoản của bạn</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nhập username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nhập mật khẩu mới"
          required
        />
        <button type="submit">Hoàn tất</button>
      </form>
    </div>
  );
};

export default EmployeeSetupPage;