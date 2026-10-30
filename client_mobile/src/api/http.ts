import axios from "axios";
import { API_URL } from "@/constants/config";
import { config } from "zod";
import { tokenStorage } from "@/services/tokenStorage";
import { logout } from "@/services/authService";

export const http = axios.create({
  baseURL: API_URL,
});

//додавання токену до кожного запиту
http.interceptors.request.use(async(config)=>{
  const token = await tokenStorage.get()
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

//обробка 401
http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const url: string = error.config?.url ?? "";
    const isAuthRequest =
      url.includes("/account/login") || url.includes("/account/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      await logout();
    }
    return Promise.reject(error);
  }
);