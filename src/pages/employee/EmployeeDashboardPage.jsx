import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// MUI Components
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Chip, // Dùng để hiển thị status đẹp hơn
  Paper, // Dùng để bọc List cho đẹp
  Divider // Ngăn cách các item
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Your existing imports
import empApi from '@api/EmployeeApi.js'; // Đảm bảo tên api nhất quán
import EditProfilePopup from '../../components/employee/editProfilePopup';
import { IconUserEdit } from '@tabler/icons-react';
import ChatWindow from '../../components/chat/chatWindow';

const EmployeeDashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state loading
  const [employee, setEmployee] = useState(null);
  const empId = useSelector((state) => state.auth.employee?.empId);
  const empName = useSelector((state) => state.auth.employee?.name);
  const [openChat, setOpenChat] = useState(false);
  const [OpenEditProfilePopup, setOpenEditProfilePopup] = useState(false);

  const handleSaveChanges = async (updatedData) => {
    console.log('Dữ liệu mới cần lưu:', updatedData);
    const result = await empApi.post(`/emps/editProfile`, updatedData);
    alert('Cập nhật thông tin thành công!');

  };


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await empApi.get(`/emps/tasks/${empId}`);
        console.log(response);
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Không thể tải công việc:', error);
      } finally {
        setLoading(false); // Dừng loading dù thành công hay thất bại
      }
    };
    const fetchProfile = async () => {
      const response = await empApi.get(`/emps/profile/${empId}`);
      console.log(response);
      setEmployee(response.data.emp);
    }

    if (empId) {
      fetchProfile();
      fetchTasks();
    }
  }, [empId]);

  const handleCompleteTask = async (taskId) => {
    try {
      await empApi.post(`/emps/completeTask`, { taskId });
      alert('Complete task!');
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: 'completed' } : task
      ));
    } catch (error) {
      console.error('Error occurs:', error);
      alert('Some errors occurs, cannot complete task.');
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Giao diện chính
  return (
    <Container maxWidth="md">

      <Box sx={{ my: 4 }}> {/* my = margin top & bottom */}
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {empName}!
        </Typography>
        {empId && <Button
          color="inherit"
          // variant="outlined"
          onClick={() => setOpenEditProfilePopup(true)}
          startIcon={<IconUserEdit />}
        >
          Edit Profile
        </Button>}

        <Typography variant="h5" component="h2" sx={{ mt: 5, mb: 2 }}>
          My Task
        </Typography>

        <Paper elevation={3}>
          {tasks.length > 0 ? (
            <List>
              {tasks.map((task, index) => (
                <React.Fragment key={task.id}>
                  <ListItem
                    secondaryAction={ // Các hành động phụ ở cuối item
                      task.status === 'pending' && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<CheckCircleOutlineIcon />}
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Complete
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Chip
                          label={task.status}
                          color={task.status === 'pending' ? 'warning' : 'success'}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      }
                    />
                  </ListItem>
                  {/* Thêm đường kẻ ngăn cách, trừ item cuối cùng */}
                  {index < tasks.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography sx={{ p: 3, textAlign: 'center' }}>
              Great! You havenot task to wait.
            </Typography>
          )}
        </Paper>
        <ChatWindow
          currentUser={employee}
          recipient={{ id: '+84962442723', name: 'Owner' }}
          onClose={() => setOpenChat(true)}
        />

      </Box>
      <EditProfilePopup
        open={OpenEditProfilePopup}
        onClose={() => setOpenEditProfilePopup(false)}
        employeeData={employee}
        onSave={handleSaveChanges}
      />
    </Container>
  );
};

export default EmployeeDashboardPage;