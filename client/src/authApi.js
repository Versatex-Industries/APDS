import api from './api';

// Define login and register functions
export const login = async (username, password) => {
    const response = await api.post('/login', { username, password });
    return response.data;
};

export const register = async (username, password) => {
    const response = await api.post('/register', { username, password });
    return response.data;
};
