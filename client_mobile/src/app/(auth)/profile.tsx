import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "@/api/authApi";
import { imageUrl } from "@/constants/config";
import { logout } from "@/services/authService";
import { IProfileType } from "@/types/profile/IProfileType";
import { confirm } from "@/utils/confirm";
import { parseApiError } from "@/utils/parseApiError";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<IProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await authApi.getProfile());
    } catch (e) {
      setError(parseApiError(e).general ?? "Не вдалося завантажити профіль");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onLogoutPress = () =>
    confirm("Вихід", "Ви дійсно хочете вийти з акаунта?", logout, "Вийти");

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  if (error || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50 items-center justify-center px-6">
        <Text className="text-red-600 text-center mb-4">
          {error ?? "Профіль не знайдено"}
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-xl mb-3 active:bg-blue-700"
          onPress={load}
        >
          <Text className="text-white font-semibold">Спробувати ще раз</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text className="text-slate-500">Вийти</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const photo = imageUrl(profile?.image);
  console.log("image from API:", profile.image, "→ url:", photo);
  const initials = (
    `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}` ||
    profile.email[0] ||
    "?"
  ).toUpperCase();
  const fullName =
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    "Користувач";

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-10"
      >
        <View className="w-full max-w-sm self-center items-center">
          {photo ? (
            <Image
              source={{ uri: photo }}
              className="w-40 h-40 rounded-full bg-slate-200 mb-6"
              resizeMode="cover"
            />
          ) : (
            <View className="w-40 h-40 rounded-full bg-blue-100 items-center justify-center mb-6">
              <Text className="text-5xl font-bold text-blue-600">
                {initials}
              </Text>
            </View>
          )}

          <Text className="text-2xl font-bold text-slate-900">{fullName}</Text>
          <Text className="text-slate-500 mb-6">{profile.email}</Text>

          <View className="w-full bg-white border border-slate-200 rounded-xl p-4 mb-6">
            <Field label="ID" value={String(profile.id)} />
            <Field label="Ім'я" value={profile.firstName} />
            <Field label="Прізвище" value={profile.lastName} />
            <Field label="Ролі" value={profile.roles.join(", ")} last />
          </View>

          <TouchableOpacity
            className="w-full bg-gray-900 py-4 rounded-2xl items-center justify-center mb-4 shadow-md shadow-gray-300 active:scale-[0.98] active:bg-black"
            onPress={() => router.push("/(tabs)/tasks")}
          >
            <Text className="text-white font-semibold text-lg">Мої задачі</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full bg-gray-100 py-4 rounded-2xl items-center justify-center border border-gray-200 active:scale-[0.98] active:bg-gray-200"
            onPress={onLogoutPress}
          >
            <Text className="text-gray-700 font-semibold text-lg">Вийти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  last = false,
}: {
  label: string;
  value?: string | null;
  last?: boolean;
}) {
  return (
    <View
      className={`flex-row justify-between py-2 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <Text className="text-slate-500">{label}</Text>
      <Text className="text-slate-900 font-medium">{value || "—"}</Text>
    </View>
  );
}