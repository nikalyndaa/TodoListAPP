import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const KEY = "token";

export const tokenStorage = {
  async set(token: string) {
    if (Platform.OS === "web") return localStorage.setItem(KEY, token);
    await SecureStore.setItemAsync(KEY, token);
  },
  async get() {
    if (Platform.OS === "web") return localStorage.getItem(KEY);
    return SecureStore.getItemAsync(KEY);
  },
  async remove() {
    if (Platform.OS === "web") return localStorage.removeItem(KEY);
    await SecureStore.deleteItemAsync(KEY);
  },
};