import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@clerk/tanstack-react-start";
import { useCreateNote } from "@app/api-client";
import { apiClient } from "@/providers/apiClient";
import { NoteForm } from "../$noteId/-NoteForm";
import { toast } from "sonner";
import type * as Schemas from "@app/schemas";

export const Route = createFileRoute("/_authenticated/notes/new/")({
  component: NewNotePage,
});

function NewNotePage() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const createNote = useCreateNote(apiClient, getToken);

  async function handleSubmit(value: Schemas.NoteBase) {
    try {
      await createNote.mutateAsync({ note: value });
      navigate({ to: "/notes" });
    } catch {
      toast.error("Failed to create note. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">New note</h1>
      <NoteForm
        currentTitle="New Note"
        currentBody={null}
        submitLabel="Create note"
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: "/notes" })}
      />
    </div>
  );
}
