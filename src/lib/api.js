import axios from "axios";

const rawBaseUrl = import.meta.env.DEV
    ? "/api"
    : (import.meta.env.VITE_API_URL ?? "/api");
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const requestUrl = error?.config?.url ?? '';
        const isAuthRequest = requestUrl.includes('users/login') || requestUrl.includes('users/register');

        if ((status === 401 || status === 403) && !isAuthRequest) {
            // Clear auth state and force a fresh login view.
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.setItem('sessionExpired', '1');
            window.location.assign('/');
        }
        return Promise.reject(error);
    }
);

const getApi = (endpoint, token = '') => {
    return api.get(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const postApi = (endpoint, payload, token = '') => {
    return api.post(endpoint, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const putApi = (endpoint, payload, token = '') => {
    return api.put(endpoint, payload, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const deleteApi = (endpoint, token = '') => {
    return api.delete(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export { getApi, postApi, putApi, deleteApi };