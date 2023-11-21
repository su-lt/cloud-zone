import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8088/v1/api/",
});
api.defaults.withCredentials = true;

// Cấu hình interceptor cho request
api.interceptors.request.use(
    (config) => {
        const userId = localStorage.getItem("id");

        // Nếu có AccessToken, thì thêm vào header Authorization
        if (userId) config.headers["x-client-id"] = userId;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Cấu hình interceptor cho response
api.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized)
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Gọi lên server để đòi AccessToken mới (thực hiện theo nhu cầu của bạn)
                // Ví dụ: await refreshToken()

                // Thêm AccessToken mới vào header và thực hiện lại request ban đầu
                const newRequest = await axios({
                    ...originalRequest,
                    headers: {
                        ...originalRequest.headers,
                    },
                });

                return Promise.resolve(newRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

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
