import { Link } from "expo-router";
import { View, Text ,TouchableOpacity} from "react-native";

export default function HomeScreen(){
    return(
         <View className="flex-1 bg-slate-50 items-center justify-center px-6">
            <View className="w-full max-w-sm items-center">
                <Text className="text-4xl font-extrabold text-slate-900 mb-3 text-center">
                Вітаємо!
                </Text>
                <Text className="text-base text-slate-600 text-center mb-8">
                Будь ласка, увійдіть у свій акаунт або зареєструйтеся, щоб продовжити.
                </Text>

                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity className="w-full bg-blue-600 py-3.5 rounded-xl items-center shadow-sm active:bg-blue-700 mb-4">
                        <Text className="text-white font-semibold text-lg">Увійти</Text>
                    </TouchableOpacity>
                </Link>
                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity className="w-full bg-blue-600 py-3.5 rounded-xl items-center shadow-sm active:bg-blue-700 mb-4">
                        <Text className="text-white font-semibold text-lg">зареєструйтеся</Text>
                    </TouchableOpacity>
                </Link>

            </View>
         </View>
    )
}