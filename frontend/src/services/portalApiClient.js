import axios from "axios";
import { API_BASE_URL } from "../config/api";

const portalApiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default portalApiClient;
