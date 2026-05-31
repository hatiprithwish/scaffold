import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { View, Text, Pressable, FlatList } from "react-native";
import { NotesQueries } from "@app/api-client";
import { apiClient } from "@/providers/apiClient";

export default function NotesScreen() {
  const { getToken } = useAuth();
  const { data, isPending, isError } = useQuery(NotesQueries.list(apiClient, getToken));
  const notes = data?.notes ?? [];

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Failed to load notes.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-4 pt-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-2xl font-semibold">Notes</Text>
        <Link href="/(authenticated)/notes/new" asChild>
          <Pressable className="bg-black rounded-lg px-4 py-2">
            <Text className="text-white font-medium">New note</Text>
          </Pressable>
        </Link>
      </View>

      {notes.length === 0 ? (
        <Text className="text-gray-500">No notes yet.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(note) => String(note.id)}
          renderItem={({ item: note }) => (
            <Link href={`/(authenticated)/notes/${note.id}`} asChild>
              <Pressable className="border border-gray-200 rounded-lg p-4 mb-3">
                <Text className="font-medium">{note.title}</Text>
                {note.body && (
                  <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
                    {note.body}
                  </Text>
                )}
              </Pressable>
            </Link>
          )}
        />
      )}
    </View>
  );
}
