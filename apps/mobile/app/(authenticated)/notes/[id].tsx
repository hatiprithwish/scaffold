import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TextInput, Pressable, Alert, ScrollView } from "react-native";
import { useState } from "react";
import { NotesQueries, useUpdateNote, useDeleteNote } from "@app/api-client";
import { apiClient } from "@/providers/apiClient";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = Number(id);
  const { getToken } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  const { data, isPending, isError } = useQuery(NotesQueries.detail(noteId, apiClient, getToken));
  const note = data?.note;

  const updateNote = useUpdateNote(apiClient, getToken);
  const deleteNote = useDeleteNote(apiClient, getToken);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !note) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Note not found.</Text>
      </View>
    );
  }

  function startEditing() {
    setEditTitle(note!.title);
    setEditBody(note!.body ?? "");
    setIsEditing(true);
  }

  async function handleSave() {
    try {
      await updateNote.mutateAsync({
        id: noteId,
        body: { note: { title: editTitle, body: editBody || null } },
      });
      setIsEditing(false);
    } catch {
      Alert.alert("Error", "Failed to update note. Please try again.");
    }
  }

  function handleDelete() {
    Alert.alert("Delete note", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteNote.mutate(noteId, {
            onSuccess: () => router.replace("/(authenticated)/notes"),
            onError: () => Alert.alert("Error", "Failed to delete note. Please try again."),
          }),
      },
    ]);
  }

  return (
    <ScrollView className="flex-1 px-4 pt-6">
      <View className="flex-row justify-between mb-4">
        <Pressable onPress={() => router.back()}>
          <Text className="text-blue-600">← Back</Text>
        </Pressable>
        <View className="flex-row gap-3">
          {!isEditing && (
            <Pressable onPress={startEditing}>
              <Text className="text-blue-600">Edit</Text>
            </Pressable>
          )}
          <Pressable onPress={handleDelete} disabled={deleteNote.isPending}>
            <Text className="text-red-500">Delete</Text>
          </Pressable>
        </View>
      </View>

      {isEditing ? (
        <View className="gap-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-lg font-medium"
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Title"
          />
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3"
            value={editBody}
            onChangeText={setEditBody}
            placeholder="Body"
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          <View className="flex-row gap-3 justify-end">
            <Pressable onPress={() => setIsEditing(false)}>
              <Text className="text-gray-500">Cancel</Text>
            </Pressable>
            <Pressable
              className="bg-black rounded-lg px-4 py-2"
              onPress={handleSave}
              disabled={updateNote.isPending}
            >
              <Text className="text-white font-medium">
                {updateNote.isPending ? "Saving..." : "Save"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View className="gap-2">
          <Text className="text-2xl font-semibold">{note.title}</Text>
          {note.body ? (
            <Text className="text-gray-600">{note.body}</Text>
          ) : (
            <Text className="text-gray-400 italic">No body.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
