import axios, { AxiosRequestHeaders } from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        (config.headers as AxiosRequestHeaders)["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default api;