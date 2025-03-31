import axios from "axios";

const API_URL = "http://localhost:8080"; // Замени на свой backend

export const register = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/register`, {"email": email, "password": password });
    return res.data;
};

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, {"email": email, "password": password });
    return res.data;
};

export const verifyCode = async (email: string, code: string) => {
    const res = await axios.post(`${API_URL}/verify`, {"email": email, "code": code });
    return res.data;
};

export const verify2faCode = async (email: string, code: string) => {
    const res = await axios.post(`${API_URL}/verify`, {"email": email, "code": code });
    return res.data;
};
