import axios from "axios";

const rawBaseUrl = import.meta.env.DEV
    ? "/api"
    : (import.meta.env.VITE_API_URL ?? "/api");
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const api = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" }
});

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