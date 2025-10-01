import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  owner: {
    accessToken: null,
    isAuthenticated: false,
    phoneNumber: null,
  },
  employee: {
    isAuthenticated: false,
    token: null,
    empId: null, // Để lưu thông tin chi tiết của employee
    name: null,
    username: null,
    email: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // forOwnerrrrrr
    setOwnerCredentials: (state, action) => {
      state.owner.accessToken = action.payload.accessToken;
      state.owner.phoneNumber = action.payload.phoneNumber;
      state.owner.isAuthenticated = true;
    },
    logoutOwner: (state) => {
      state.owner.accessToken = null;
      state.owner.isAuthenticated = false;
      state.owner.phoneNumber = null;
    },
    // for Employeeeeeee 
    setEmployeeCredentials: (state, action) => {
      state.employee.token = action.payload.token;
      state.employee.empId = action.payload.employee.id;
      state.employee.email = action.payload.employee.email;
      state.employee.username = action.payload.employee.username;
      state.employee.name = action.payload.employee.name;
      state.employee.isAuthenticated = true;
    },
    logoutEmployee: (state) => {
      state.employee.isAuthenticated = false;
      state.employee.token = null;
      state.employee.empId = null;
      state.employee.email = null;
      state.employee.username = null;
      state.employee.name = null;
    }
  }
});

export const { setOwnerCredentials, logoutOwner, setEmployeeCredentials, logoutEmployee
} = authSlice.actions;

export default authSlice.reducer;
