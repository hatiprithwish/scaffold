import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function RootIndex() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  return isSignedIn ? (
    <Redirect href="/(authenticated)/notes" />
  ) : (
    <Redirect href="/(auth)/sign-in" />
  );
}
