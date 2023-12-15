import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Cấu hình interceptor cho request
api.interceptors.request.use(async (config) => {
    // if (
    //     config.url.indexOf("/login") > -1 ||
    //     config.url.indexOf("/signup") > -1 ||
    //     config.url.includes("/categories") ||
    //     config.url.includes("/products")
    // ) {
    //     return config;
    // }
    config.headers["x-client-id"] = localStorage.getItem("id") || null;
    return config;
});

// Cấu hình interceptor cho response
api.interceptors.response.use();

// Hàm đăng nhập
export const login = async (email, password) => {
    try {
        const response = await api.post("/login", { email, password });
        const { id, username } = response.data.metadata;

        // set id, username to localStorage
        localStorage.setItem("id", id);
        localStorage.setItem("username", username);

        return { username };
    } catch (error) {
        return { error: error.response.data.message };
    }
};

// Hàm đăng nhập
export const signup = async (fullname, email, password) => {
    try {
        const response = await api.post("/signup", {
            fullname,
            email,
            password,
        });
        const { id } = response.data.metadata;

        // set id to localStorage
        localStorage.setItem("id", id);

        return null;
    } catch (error) {
        return error.response.data.message;
    }
};

// Hàm đăng nhập
export const refreshToken = async () => {
    try {
        const response = await api.post("/refresh");
        console.log(response);
        // set id to localStorage
        // localStorage.setItem("id", id);

        return null;
    } catch (error) {
        // throw error;
    }
};

export default api;
