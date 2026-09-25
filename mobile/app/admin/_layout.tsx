import { Redirect, Stack, useSegments } from "expo-router";

import LoadingScreen from "../../components/ui/LoadingScreen";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const segments = useSegments();
  console.log("segments", segments)

  /**
   * While we are checking local storage / SecureStore,
   * don't render either the dashboard or login redirect.
   */
  if (loading) {
    return (
      <LoadingScreen message="Checking authentication..." />
    );
  }

  /**
   * Current route inside /admin.
   *
   * Example:
   *
   * /admin
   * segments = ["admin"]
   *
   * /admin/login
   * segments = ["admin", "login"]
   */
  const isLoginPage = segments[0] === "login";

  /**
   * User is not authenticated.
   *
   * Allow the login page to render.
   * Redirect every other admin page to login.
   */
  if (!isAuthenticated && !isLoginPage) {
    return <Redirect href="/admin/login" />;
  }

  /**
   * User is authenticated but is trying to visit login.
   *
   * Send them to dashboard.
   */
  if (isAuthenticated && isLoginPage) {
    return <Redirect href="/admin" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}