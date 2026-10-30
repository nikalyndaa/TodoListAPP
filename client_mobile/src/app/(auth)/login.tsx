import { authApi } from "@/api/authApi";
import { LoginSchema } from "@/schemas/LoginSchema";
import { tokenStorage } from "@/services/tokenStorage";
import { ILoginType } from "@/types/login/ILoginType";
import { parseApiError } from "@/utils/parseApiError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: ILoginType) => {
    console.log("Login:", data);

    if (loading) return;
    setServerError(null);
    setLoading(true);

    try {
      const { token } = await authApi.login(data);
      await tokenStorage.set(token);
      console.log("Login:", data);

      router.replace("/(auth)/profile")
    } catch (e) {
      const { general, fields } = parseApiError(e);
      const unmatched: string[] = [];

      for (const [name, message] of Object.entries(fields)) {
        if (name === "email" || name === "password") {
          setError(name, { type: "server", message });
        } else {
          unmatched.push(message);
        }
      }

      const text = [general, ...unmatched].filter(Boolean).join("\n");
      if (text) setServerError(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm self-center">
          <Text className="text-3xl font-bold text-slate-900 mb-2">
            З поверненням!
          </Text>
          <Text className="text-slate-500 mb-6">
            Введіть свої дані для входу.
          </Text>

          {/* Email */}
          <Text className="text-sm font-medium text-slate-700 mb-1">Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-1 text-slate-900"
                placeholder="example@mail.com"
                placeholderTextColor="#94a3b8"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.email.message}
            </Text>
          )}

          {/* Пароль */}
          <Text className="text-sm font-medium text-slate-700 mb-1 mt-2">
            Пароль
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-1 text-slate-900"
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="none"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.password.message}
            </Text>
          )}

          {/* Помилка сервера */}
          {serverError && (
            <View className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 mt-2">
              <Text className="text-red-600 text-sm">{serverError}</Text>
            </View>
          )}

          <TouchableOpacity
            className="w-full bg-blue-600 py-3.5 rounded-xl items-center mb-4 active:bg-blue-700 mt-2"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">Увійти</Text>
            )}
          </TouchableOpacity>

          <Link
            href="/(auth)/register"
            className="text-center text-blue-600 font-medium mb-3"
          >
            Немає акаунту? Зареєструватися
          </Link>
          <Link href="/" className="text-center text-slate-500 font-medium">
            ← На головну
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
