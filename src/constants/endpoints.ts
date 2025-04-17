const API_HOST = import.meta.env.VITE_API_URL;
const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH;
const API_HOST_EXCHANGE = import.meta.env.VITE_EXCHANGE_API_URL;

export const API_BASE = `${API_HOST}${API_BASE_PATH}`;

export const API_EXCHANGE = `${API_HOST_EXCHANGE}${API_BASE_PATH}`;