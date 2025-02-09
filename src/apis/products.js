import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/products';

export const allProducts = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Retrieval failed');
    }
};

export const byId = async (token, product_id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Not found');
    }
};

export const create = async (token, product_name, product_description, price, tags, images) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, { product_name, product_description, price, tags, images }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Creation failed');
    }
};

export const update = async (token, product_name, product_description, price, tags, product_id) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}/${product_id}`, { product_name, product_description, price, tags }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed');
    }
};

export const deleteProduct = async (token, product_id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/${product_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed');
    }
};

export const productsByTagId = async (token, tag_id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tag/${tag_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Not found');
    }
};

export const getAllTags = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tags/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed")
    }
}

export const rate = async (token, product_id, rating, review_text = null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/${product_id}/rate`, { rating, review_text }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Not found');
    }
};