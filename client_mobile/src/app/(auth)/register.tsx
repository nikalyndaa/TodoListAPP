import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { authApi } from "@/api/authApi";
import { ImagePickerButton } from "@/components/form/ImagePickerButton";
import { RegisterSchema } from "@/schemas/RegisterSchema";
import { tokenStorage } from "@/services/tokenStorage";
import { IRegisterType } from "@/types/register/IRegisterType";
import { parseApiError } from "@/utils/parseApiError";

const FIELD_NAMES = [
  "firstName",
  "lastName",
  "email",
  "password",
  "confirmPassword",
  "imageFile",
] as const;
type FieldName = (typeof FIELD_NAMES)[number];

const inputClass =
  "w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-1 text-slate-900";
const labelClass = "text-sm font-medium text-slate-700 mb-1 mt-2";
const errorClass = "text-red-500 text-xs mb-2";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<IRegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const image = watch("imageFile");

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Доступ до галереї потрібен для вибору фото.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop()?.toLowerCase() ?? "jpg";

    setValue(
      "imageFile",
      {
        url: asset.uri,
        name: asset.fileName ?? `avatar.${ext}`,
        type: asset.mimeType ?? `image/${ext === "jpg" ? "jpeg" : ext}`,
      },
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: IRegisterType) => {
    if (loading) return;
    setServerError(null);
    setLoading(true);

    try {
      const { token } = await authApi.register(data);
      await tokenStorage.set(token);
         console.log("Login:",data)

      router.replace("/(auth)/profile")
    } catch (e) {
      const { general, fields } = parseApiError(e);
      const unmatched: string[] = [];

      for (const [name, message] of Object.entries(fields)) {
        if ((FIELD_NAMES as readonly string[]).includes(name)) {
          setError(name as FieldName, { type: "server", message });
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
            Реєстрація
          </Text>
          <Text className="text-slate-500 mb-6">Створення акаунту</Text>

          {/* Ім'я */}
          <Text className={labelClass}>Ім'я</Text>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputClass}
                placeholder="Введіть ваше ім'я"
                placeholderTextColor="#94a3b8"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            )}
          />
          {errors.firstName && (
            <Text className={errorClass}>{errors.firstName.message}</Text>
          )}

          {/* Прізвище */}
          <Text className={labelClass}>Прізвище</Text>
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputClass}
                placeholder="Введіть ваше прізвище"
                placeholderTextColor="#94a3b8"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="words"
              />
            )}
          />
          {errors.lastName && (
            <Text className={errorClass}>{errors.lastName.message}</Text>
          )}

          {/* Email */}
          <Text className={labelClass}>Електронна адреса</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputClass}
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
            <Text className={errorClass}>{errors.email.message}</Text>
          )}

          {/* Пароль */}
          <Text className={labelClass}>Пароль</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputClass}
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
            <Text className={errorClass}>{errors.password.message}</Text>
          )}

          {/* Повторіть пароль */}
          <Text className={labelClass}>Повторіть пароль</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={inputClass}
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
          {errors.confirmPassword && (
            <Text className={errorClass}>{errors.confirmPassword.message}</Text>
          )}

          {/* Фото */}
          <Text className={labelClass}>Фото профілю</Text>
          <View className="items-center my-4">
            <ImagePickerButton
              imageUri={image?.url ?? null}
              onPress={pickImage}
            />
            <Text className="text-zinc-400 mt-2">
              Натисніть, щоб обрати фото
            </Text>
          </View>
          {errors.imageFile && (
            <Text className={errorClass}>
              {errors.imageFile.message as string}
            </Text>
          )}

          {/* Помилка сервера */}
          {serverError && (
            <View className="w-full bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <Text className="text-red-600 text-sm">{serverError}</Text>
            </View>
          )}

          <TouchableOpacity
            className="w-full bg-blue-600 py-3.5 rounded-xl items-center mb-4 active:bg-blue-700"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-lg">
                Зареєструватися
              </Text>
            )}
          </TouchableOpacity>

          <Link
            href="/(auth)/login"
            className="text-center text-blue-600 font-medium mb-3"
          >
            Вже є акаунт? Увійти
          </Link>
          <Link href="/" className="text-center text-slate-500 font-medium">
            ← На головну
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}