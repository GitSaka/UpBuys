import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.token;

      const response = await api.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue({"error":error, "message":"Session expirée"});
    }
  }
);

// register thunk
export const registerAdmin = createAsyncThunk(
  'auth/registerAdmin',
  async (formData, thunkAPI) => {
    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        userName: formData.slug,
        storeName: formData.storeName,
        telephone: formData.telephone,
        countryCode: formData.countryCode,
        category:formData.category
      });

      return {
        user: response.data.user,
        token: response.data.token
      };

    } catch (error) {
      // rejectWithValue permet de récupérer l'erreur dans extraReducers
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Erreur serveur");
    }
  }
);


export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, thunkAPI) => {
    try {
      const response = await api.post(
        "/auth/login",
        credentials
      );

      return response.data; 
      // { token, user }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Erreur de connexion"
      );
    }
  }
);
