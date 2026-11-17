import type { NullableDALFields } from "../common";
import type { Note, NoteBase } from "./NotesCommon";

export type CreateNoteDALRequest = NoteBase & Pick<Note, "userId">;

// Params to find a note by its public ID and user ID (for authorization)
export type FindNoteDALRequest = Pick<Note, "publicId" | "userId">;

export type GetNotesDALRequest = Pick<Note, "userId">;

// DEV_NOTE: Only the client-editable fields; the DAL sets updatedAt itself.
export type UpdateNoteDALRequest = FindNoteDALRequest & NullableDALFields<NoteBase>;
