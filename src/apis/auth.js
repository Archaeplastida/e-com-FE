import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/auth';

export const login = async (user_name, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { user_name, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async (token) => {
  try {
    await axios.get(`${API_BASE_URL}/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};