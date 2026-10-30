import Constants from "expo-constants";
import { Platform } from "react-native";

const PORT = 5000;

function getDevHost(): string {
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  if (host && host !== "localhost" && host !== "127.0.0.1") return host;
  return Platform.OS === "android" ? "10.0.2.2" : "localhost";
}

export const SITE_URL = `http://${getDevHost()}:${PORT}`

export const API_URL = `${SITE_URL}/api`;

export const AVATAR_SIZE = 432;
export const imageUrl = (name?: string | null, size = AVATAR_SIZE) =>
  name ? `${SITE_URL}/images/${name}_${size}.webp` : null;