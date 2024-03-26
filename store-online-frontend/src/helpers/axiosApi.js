import axios from "axios";

export const provinceApi = axios.create({
    // baseURL: process.env.REACT_APP_PROVINCE_API_URL,
    maxBodyLength: Infinity,
});

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
api.defaults.withCredentials = true;

let isRefreshing = false;
let refreshQueue = [];

// set interceptor request
api.interceptors.request.use(async (config) => {
    if (
        config.url.indexOf("/login") > -1 ||
        config.url.indexOf("/signup") > -1 ||
        config.url.indexOf("/forgot") > -1 ||
        config.url.indexOf("/reset") > -1
    ) {
        return config;
    }
    // set headers - authentication
    config.headers["x-client-id"] = localStorage.getItem("id") || null;
    config.headers["x-token"] = localStorage.getItem("accessToken") || null;
    return config;
});

// set interceptor response
api.interceptors.response.use(
    async (response) => {
        const config = response.config;
        if (
            config.url.indexOf("/login") > -1 ||
            config.url.indexOf("/signup") > -1 ||
            config.url.indexOf("/forgot") > -1 ||
            config.url.indexOf("/reset") > -1
        ) {
            return response;
        }
        const { code, message } = response.data;
        // console.log(">>>>>>>>> tra ve:", code, message, isRefreshing);
        if (code && code === 401) {
            if (message && message === "TokenExpiredError") {
                if (!isRefreshing) {
                    isRefreshing = true;

                    const { newAccessToken } = await handleRefreshToken();
                    if (newAccessToken) {
                        // set new access token to local storage
                        localStorage.setItem("accessToken", newAccessToken);

                        // Đặt lại cờ sau khi làm mới
                        isRefreshing = false;

                        // Xử lý các yêu cầu đã được xếp hàng (nếu có)
                        refreshQueue.forEach((resolve) => resolve());
                        refreshQueue = [];

                        // return -> call request again
                        return api(config);
                    } else {
                        return Promise.reject(response);
                    }
                } else {
                    return new Promise((resolve) => {
                        refreshQueue.push(() => {
                            response.config.headers["x-token"] =
                                localStorage.getItem("accessToken") || null;
                            resolve(api(response.config));
                        });
                    });
                }
            }
        }
        return response;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// handle refresh token
export const handleRefreshToken = async () => {
    const res = await api.get("/access/refresh");
    return res.data.metadata;
};

export default api;
