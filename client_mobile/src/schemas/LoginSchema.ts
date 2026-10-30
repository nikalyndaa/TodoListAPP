import {z} from "zod"

export const LoginSchema = z.object({
    email: z.email("Вкажіть правильну електронну пошту"),
    password: z.string().min(6,"Пароль має мати 6 символів")
})
