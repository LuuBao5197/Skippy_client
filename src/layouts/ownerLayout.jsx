import React from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {logoutOwner} from '../redux/slices/authSlice'
const OwnerLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem('ownerPhone');
    dispatch(logoutOwner())
    navigate('/');
  };

  return (
    <div>
      <header style={{ background: '#f0f0f0', padding: '1rem', display: 'flex', justifyContent: 'space-between' }}>
        <nav>
          <Link to="/owner/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
          <Link to="/owner/taskboard" style={{ marginRight: '1rem' }}>TaskManage</Link>
          {/* Thêm các link khác cho Owner ở đây */}
        </nav>
        <button onClick={handleLogout}>Đăng xuất</button>
      </header>
      <main style={{ padding: '1rem' }}>
        {/* Các trang con của Owner sẽ được render ở đây */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default OwnerLayout;