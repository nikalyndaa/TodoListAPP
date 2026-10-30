import { ILoginType } from "@/types/login/ILoginType";
import { http } from "./http";
import { IRegisterType } from "@/types/register/IRegisterType";
import { ILoginResult } from "@/types/login/ILoginResult";
import { IProfileType } from "@/types/profile/IProfileType";

export type AuthResponse = { token: string };

export const authApi = {
  async register(data: IRegisterType): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("firstName", data.firstName.trim());
    formData.append("lastName", data.lastName.trim());
    formData.append("email", data.email.trim());
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);

    if (data.imageFile) {
      formData.append("imageFile", {
        uri: data.imageFile.url,
        name: data.imageFile.name,
        type: data.imageFile.type,
      } as any);
    }

    const res = await http.post<AuthResponse>("/account/register", formData, {
    });
    return res.data;
  },

  async login(data: ILoginType): Promise<ILoginResult> {
    const res = await http.post<ILoginResult>("/account/login", {
      email: data.email.trim(),
      password: data.password,
    });
    return res.data;
  },

  async getProfile(): Promise<IProfileType>{
    const res = await http.get<IProfileType>("/account/profile")
    return res.data
  }

};