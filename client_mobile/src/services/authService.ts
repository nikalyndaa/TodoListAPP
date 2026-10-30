import { router } from "expo-router";
import { tokenStorage } from "./tokenStorage";

export async function logout() {
    await tokenStorage.remove()
    router.replace("/login")
}