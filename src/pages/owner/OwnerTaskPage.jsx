import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';

// MUI Components
import {
  Container, Typography, Box, Paper, TextField, Button, Stack,
  Select, MenuItem, FormControl, InputLabel, Chip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import ownerApi from '@api/OwnerApi.js';

const OwnerTaskPage = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ title: '', description: '', employeeId: '' });

  const phoneNumber = useSelector((state) => state.auth.owner?.phoneNumber);


  const fetchAllData = async () => {
    setLoading(true);
    try {
      const empsResponse = await ownerApi.get(`/owners/getEmps/${phoneNumber}`);
      setEmployees(empsResponse.data.empList || []);
      const tasksResponse = await ownerApi.get(`/owners/getTasks`);
      console.log(tasksResponse);
      setTasks(tasksResponse.data.tasks || []);

    } catch (error) {
      console.error('Không thể tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchAllData();
    }
  }, [phoneNumber]);

  // --- HANDLERS ---
  const handleAssignTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.employeeId) {
      alert('Please enter taskname and choice employee.');
      return;
    }
    try {
      await ownerApi.post('/owners/assignTask', { ...newTask, ownerId: phoneNumber });
      alert('Assign task successfully!');
      setNewTask({ title: '', description: '', employeeId: '' }); 
      fetchAllData(); 
    } catch (error) {
      alert('Lỗi khi giao việc.');
      console.error(error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Bạn có chắc muốn xóa công việc này?')) {
      try {
        await ownerApi.delete(`/owners/deleteTask/${taskId}`);
        alert('Delete successfully.');
        fetchAllData(); 
      } catch (error) {
        alert('Error occurs');
        console.error(error);
      }
    }
  };

  // --- DATAGRID CONFIGURATION ---


  const columns = [
    { field: 'title', headerName: 'Task Name', flex: 1.5 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'employeeId',
      headerName: 'Assign by',
      flex: 1,
      valueGetter: (params) => {
        const emp = employees.find(e => e.id == params);
        return emp ? emp.name : 'N/A';
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'pending' ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Action',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteTask(params.row.id)}
          color="error"
        />,
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Task Manager
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>New Assign Task</Typography>
        <Box component="form" onSubmit={handleAssignTask}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
            <TextField
              label="Task Name"
              size="small"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Description (optional)"
              size="small"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              fullWidth
            />
            <FormControl size="small" required fullWidth>
              <InputLabel>Assign Task For Employee</InputLabel>
              <Select
                value={newTask.employeeId}
                label="Giao cho nhân viên"
                onChange={(e) => setNewTask({ ...newTask, employeeId: e.target.value })}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name} ({emp.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" startIcon={<AddCircleOutlineIcon />} sx={{ minWidth: 120 }}>
              Assign Task
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, height: 600, width: '100%' }}>
        <Typography variant="h6" gutterBottom>List Task Assigned For Employee</Typography>
        <DataGrid
          rows={tasks}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id} // Đảm bảo task của bạn có 'id'
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Paper>
    </Container>
  );
};

export default OwnerTaskPage;