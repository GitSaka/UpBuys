import { createSlice } from '@reduxjs/toolkit';
import { fetchUserProfile, loginAdmin, registerAdmin } from './authThunks';


const initialState = {
  user: null,
  token: localStorage.getItem('adminToken') || null,
  isAuthenticated: !!localStorage.getItem('adminToken'),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // loginStart: (state) => {
    //   state.isLoading = true;
    //   state.error = null;
    // },
    // loginSuccess: (state, action) => {
    //   state.isLoading = false;
    //   state.isAuthenticated = true;
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   localStorage.setItem('adminToken', action.payload.token);
    // },
    // loginFailure: (state, action) => {
    //   state.isLoading = false;
    //   state.error = action.payload;
    // },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('adminToken');
    },
     updateUserInRedux: (state, action) => {
    state.user = action.payload; // ⚡ Met à jour le user global
  }
  },

  // 👇 LA PARTIE NOUVELLE (EXPERT)
extraReducers: (builder) => {
    builder
      .addCase(registerAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('adminToken', action.payload.token);
      })
       .addCase(registerAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload.data; // 🔥 juste les vraies données;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        localStorage.removeItem('adminToken');
      })
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
     })
     .addCase(loginAdmin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("adminToken", action.payload.token);
      })
      .addCase(loginAdmin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

  },

});

export const {
  updateUserInRedux,
  // loginStart,
  // loginSuccess,
  // loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
