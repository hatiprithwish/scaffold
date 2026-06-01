import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(authenticated)/notes");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className="flex-1 justify-center px-6 gap-4">
      <Text className="text-2xl font-semibold">Sign in</Text>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        className="border border-gray-300 rounded-lg px-4 py-3"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable
        className="bg-black rounded-lg py-3 items-center"
        onPress={handleSignIn}
        disabled={isSubmitting}
      >
        <Text className="text-white font-medium">{isSubmitting ? "Signing in..." : "Sign in"}</Text>
      </Pressable>
    </View>
  );
}
