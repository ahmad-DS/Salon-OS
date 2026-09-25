import { Platform } from "react-native";

const ADMIN_TOKEN_KEY = "admin_access_token";

export async function saveAdminToken(
  token: string
): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    return;
  }

  const SecureStore = await import("expo-secure-store");

  await SecureStore.setItemAsync(
    ADMIN_TOKEN_KEY,
    token
  );
}

export async function getAdminToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }

  const SecureStore = await import("expo-secure-store");

  return SecureStore.getItemAsync(
    ADMIN_TOKEN_KEY
  );
}

export async function removeAdminToken(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    return;
  }

  const SecureStore = await import("expo-secure-store");

  await SecureStore.deleteItemAsync(
    ADMIN_TOKEN_KEY
  );
}