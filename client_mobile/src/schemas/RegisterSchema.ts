import {z} from "zod"

export const RegisterSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "Введіть ім'я (мінімум 2 символи)"),

        lastName: z
            .string()
            .min(2, "Введіть прізвище (мінімум 2 символи)"),

        email: z
            .string()
            .email("Введіть коректну електронну пошту"),

        password: z
            .string()
            .min(8, "Пароль має містити мінімум 8 символів")
            .regex(/[A-Z]/, "Додайте велику літеру")
            .regex(/[a-z]/, "Додайте малу літеру")
            .regex(/[0-9]/, "Додайте цифру"),

        confirmPassword: z
            .string()
            .min(1, "Підтвердіть пароль"),
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "Паролі не збігаються",
            path: ["confirmPassword"],
        }
    );

export type RegisterSchemaType = z.infer<
    typeof RegisterSchema
>;
