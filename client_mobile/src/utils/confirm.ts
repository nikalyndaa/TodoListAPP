import { Alert, Platform } from "react-native";

export function confirm(
  title: string,
  message: string,
  onConfirm: () => void,
  confirmText = "Так"
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n${message}`)) onConfirm();
    return;
  }

  Alert.alert(title, message, [
    { text: "Скасувати", style: "cancel" },
    { text: confirmText, style: "destructive", onPress: onConfirm },
  ]);
}