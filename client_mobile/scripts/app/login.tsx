import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput , TouchableOpacity} from "react-native";

export default function LoginScreen(){
    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')

    const handleLogin = () =>{
    //logic
    console.log("Login: ", email,password)
    }

    return(
        <View className="flex-1 bg-slate-50 justify-center px-6">
            <View className="w-full max-w-sm self-center">
                <Text className="text-3xl font-bold text-slate-900 mb-2">З поверненням!</Text>
                <Text className="text-slate-500 mb-6">Введіть свої дані для входу.</Text>

                <Text className="text-sm font-medium text-slate-700 mb-1">Email</Text>
                <TextInput 
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-4 text-slate-900"
                    placeholder="example@mail.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    />
                <Text className="text-sm font-medium text-slate-700 mb-1">Пароль</Text>
                <TextInput
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 mb-6 text-slate-900"
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    />
                <TouchableOpacity 
                    className="w-full bg-blue-600 py-3.5 rounded-xl items-center mb-4 active:bg-blue-700"
                    onPress={handleLogin}
                    >
                <Text className="text-white font-semibold text-lg">Увійти</Text>
                </TouchableOpacity>

                <Link href="/" className="text-center text-blue-600 font-medium">
                ← На головну
                </Link>
        </View>
        </View>
    )
}


