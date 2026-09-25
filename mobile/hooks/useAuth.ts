// import { useCallback, useEffect, useState } from "react";
// import { getAuthSession } from "../services/auth";

// export type AuthUser = {
//   id: number;
//   name: string;
//   role: "admin" | "customer";
// };

// type AuthState = {
//   user: AuthUser | null;
//   loading: boolean;
//   isAuthenticated: boolean;
// };

// export function useAuth(): AuthState {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [loading, setLoading] = useState(true);

//   const checkAuth = useCallback(async () => {
//     try {
//       setLoading(true);

//       const session = await getAuthSession();

//       setUser(session?.user ?? null);
//     } catch (error) {
//       console.error("Failed to check authentication:", error);

//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return {
//     user,
//     loading,
//     isAuthenticated: user !== null,
//   };
// }


import { useCallback, useEffect, useState } from "react";

import {
  getAdminToken,
  removeAdminToken,
  saveAdminToken,
} from "../services/authStorage";

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
};

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
  });

  /**
   * Check whether an admin token already exists.
   *
   * This runs when the app/admin layout mounts.
   */
  const checkAuth = useCallback(async () => {
    try {
      const token = await getAdminToken();

      setAuthState({
        isAuthenticated: !!token,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to check authentication:", error);

      setAuthState({
        isAuthenticated: false,
        loading: false,
      });
    }
  }, []);

  /**
   * Store token after successful login.
   */
  const login = useCallback(async (token: string) => {
    await saveAdminToken(token);

    setAuthState({
      isAuthenticated: true,
      loading: false,
    });
  }, []);

  /**
   * Remove token during logout.
   */
  const logout = useCallback(async () => {
    await removeAdminToken();

    setAuthState({
      isAuthenticated: false,
      loading: false,
    });
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isAuthenticated: authState.isAuthenticated,
    loading: authState.loading,
    login,
    logout,
    checkAuth,
  };
}