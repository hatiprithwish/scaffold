import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Stack } from "expo-router";
import { useEffect, useRef } from "react";
import { apiClient } from "@/providers/apiClient";

export default function AuthenticatedLayout() {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isSignedIn || syncedRef.current) return;
    syncedRef.current = true;
    apiClient("/users/clerk-sync", getToken, { method: "POST" }).catch(() => {
      // Non-fatal — user may already exist; errors logged on server
    });
  }, [isSignedIn, getToken]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
