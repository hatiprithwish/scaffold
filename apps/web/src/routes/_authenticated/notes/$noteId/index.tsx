import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/tanstack-react-start";
import { useState } from "react";
import { NotesQueries, useUpdateNote, useDeleteNote } from "@app/api-client";
import { apiClient } from "@/providers/apiClient";
import NoteHeader from "./-NoteHeader";
import ViewNote from "./-ViewNote";
import { NoteForm } from "./-NoteForm";
import { toast } from "sonner";
import type * as Schemas from "@app/schemas";

export const Route = createFileRoute("/_authenticated/notes/$noteId/")({
  component: NoteDetailPage,
});

function NoteDetailPage() {
  const noteId = Number(Route.useParams().noteId);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data, isPending, isError } = useQuery(NotesQueries.detail(noteId, apiClient, getToken));
  const note = data?.note;

  const updateNote = useUpdateNote(apiClient, getToken);
  const deleteNote = useDeleteNote(apiClient, getToken);

  if (isPending) return <div>Loading...</div>;
  if (isError || !note) return <div>Note not found.</div>;

  // DEV_NOTE: mutateAsync used here — need to await save before closing the form.
  async function handleSubmit(value: Schemas.NoteBase) {
    try {
      await updateNote.mutateAsync({ id: noteId, body: { note: value } });
      setIsEditing(false);
    } catch {
      toast.error("Failed to update note. Please try again.");
    }
  }

  // DEV_NOTE: mutate (not mutateAsync) — no need to await, navigation happens in onSuccess.
  function handleDelete() {
    deleteNote.mutate(noteId, {
      onSuccess: () => navigate({ to: "/notes" }),
      onError: () => toast.error("Failed to delete note. Please try again."),
    });
  }

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">
      <NoteHeader
        isEditing={isEditing}
        isDeleting={deleteNote.isPending}
        onEdit={() => setIsEditing(true)}
        onDelete={handleDelete}
      />
      {isEditing ? (
        <NoteForm
          currentTitle={note.title}
          currentBody={note.body}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ViewNote title={note.title} body={note.body} />
      )}
    </div>
  );
}
