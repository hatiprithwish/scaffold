import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type * as Schemas from "@app/schemas";
import type { ApiClientFn, GetTokenFn } from "../apiClient";

export class NotesQueries {
  // DEV_NOTE: Keys form a hierarchy — detail extends all. Invalidating all() also invalidates every detail.
  static readonly keys = {
    all: () => ["notes"] as const,
    detail: (id: number) => ["notes", id] as const,
  };

  static list(client: ApiClientFn, getToken: GetTokenFn) {
    return queryOptions({
      queryKey: NotesQueries.keys.all(),
      queryFn: ({ signal }) => client<Schemas.GetNotesApiResponse>("/notes", getToken, { signal }),
    });
  }

  static detail(id: number, client: ApiClientFn, getToken: GetTokenFn) {
    return queryOptions({
      queryKey: NotesQueries.keys.detail(id),
      queryFn: ({ signal }) =>
        client<Schemas.GetNoteApiResponse>(`/notes/${id}`, getToken, { signal }),
    });
  }
}

export function useCreateNote(client: ApiClientFn, getToken: GetTokenFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Schemas.CreateNoteApiRequest) =>
      client<Schemas.CreateNoteApiResponse>("/notes", getToken, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: NotesQueries.keys.all() });
    },
  });
}

export function useUpdateNote(client: ApiClientFn, getToken: GetTokenFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Schemas.UpdateNoteApiRequest }) =>
      client<Schemas.UpdateNoteApiResponse>(`/notes/${id}`, getToken, {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
    onSuccess: async (response) => {
      if (response.note) {
        queryClient.setQueryData(NotesQueries.keys.detail(response.note.id), response);
      }
      await queryClient.invalidateQueries({ queryKey: NotesQueries.keys.all() });
    },
  });
}

export function useDeleteNote(client: ApiClientFn, getToken: GetTokenFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => client<void>(`/notes/${id}`, getToken, { method: "DELETE" }),
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: NotesQueries.keys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: NotesQueries.keys.all() });
    },
  });
}
