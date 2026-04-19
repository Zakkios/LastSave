import axios from "axios";
import { env } from "../config/env";

const http = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default http;
