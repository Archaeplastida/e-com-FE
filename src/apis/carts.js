import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/users';

export const getCart = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cart`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Retrieval failed');
    }
}

export const addItemToCart = async (token, product_id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cart`, { product_id }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed");
    }
}

export const removeItemFromCart = async (token, product_id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/cart`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                product_id
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to remove");
    }
}