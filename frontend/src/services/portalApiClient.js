import axios from "axios";
import { API_BASE_URL } from "../config/api";

const portalApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

portalApiClient.interceptors.request.use((config) => {
  const activeRole = sessionStorage.getItem('portal_active_role');
  if (activeRole && !config.headers?.['X-Portal-Role']) {
    config.headers = config.headers || {};
    config.headers['X-Portal-Role'] = activeRole;
  }
  return config;
});

export default portalApiClient;
