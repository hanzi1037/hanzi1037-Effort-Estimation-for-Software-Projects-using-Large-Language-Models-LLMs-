import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth";

export const signup = async (email, password) => {
    return await axios.post(`${API_URL}/signup`, { email, password });
};

export const login = async (email, password) => {
    return await axios.post(`${API_URL}/login`, { email, password });
};
