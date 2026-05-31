import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { useCreateNote } from "@app/api-client";
import { apiClient } from "@/providers/apiClient";

export default function NewNoteScreen() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const createNote = useCreateNote(apiClient, getToken);

  async function handleSubmit() {
    try {
      await createNote.mutateAsync({ note: { title, body: body || null } });
      router.replace("/(authenticated)/notes");
    } catch {
      Alert.alert("Error", "Failed to create note. Please try again.");
    }
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6">
      <View className="gap-4">
        <Text className="text-2xl font-semibold">New note</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3"
          placeholder="Body (optional)"
          value={body}
          onChangeText={setBody}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
        <Pressable
          className="bg-black rounded-lg py-3 items-center"
          onPress={handleSubmit}
          disabled={createNote.isPending}
        >
          <Text className="text-white font-medium">
            {createNote.isPending ? "Creating..." : "Create note"}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.back()}>
          <Text className="text-center text-gray-500">Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
