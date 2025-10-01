import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

// MUI Components
import {
  Container, Typography, Box, Paper, TextField, Button, Stack, InputAdornment, IconButton
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';

// Your existing imports
import ownerApi from '@api/OwnerApi.js';
import ChatWindow from '@components/chat/chatWindow.jsx';
import { display } from '@mui/system';
import { useNavigate } from 'react-router';

const OwnerDashboardPage = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', role: '' });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState(''); // State cho ô tìm kiếm
  const phoneNumber = useSelector((state) => state.auth.owner?.phoneNumber);
  const navigate = useNavigate();
  const fetchEmployees = async () => {
    try {
      const response = await ownerApi.get(`/owners/getEmps/${phoneNumber}`);
      setEmployees(response.data.empList);

    } catch (error) {
      console.error('Không thể tải danh sách nhân viên:', error);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchEmployees();
    }
  }, [phoneNumber]);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      await ownerApi.post('/owners/createEmp', newEmployee);
      alert('Create employee successfully and send mail had link setup ');
      navigate(0);
      // setNewEmployee({ name: '', email: '', role: '' });
      // fetchEmployees();
    } catch (error) {
      alert('Lỗi khi tạo nhân viên.');
      console.error(error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Bạn có chắc muốn xóa nhân viên này?')) {
      try {
        await ownerApi.delete('/owners/deleteEmp', {data: { employeeId }});
        alert('Remove employee success.');
        fetchEmployees();
      } catch (error) {
        alert('Delete employee failed');
        console.error(error);
      }
    }
  };

  const columns = [
    { field: 'name', headerName: 'Employee Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'role', headerName: 'Position', flex: 1 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ChatIcon />}
          label="Chat"
          onClick={() => setSelectedEmployee(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteEmployee(params.row.id)}
          color="error"
        />,
      ],
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Owner
      </Typography>

      {/* Form Create Employee */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom> Add New Employee</Typography>
        <Box component="form" onSubmit={handleCreateEmployee}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField label="Name" size="small" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
            <TextField label="Email" type="email" size="small" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
            <TextField label="Position" size="small" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} required />
            <Button type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />}>Submit</Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, height: 600, width: '100%' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search employee by name or email"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <DataGrid
          rows={filteredEmployees}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      </Paper>

      {/* Cửa sổ Chat */}
      {selectedEmployee && (
        <ChatWindow
          currentUser={{ id: phoneNumber, name: 'Owner' }}
          recipient={selectedEmployee}
          // onClose={() => setSelectedEmployee(null)} 
        />
      )}
    </Container>
  );
};

export default OwnerDashboardPage;