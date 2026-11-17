import type { NullableDALFields } from "../common";
import type { Note, NoteBase } from "./NotesCommon";

export type CreateNoteDALRequest = NoteBase & Pick<Note, "userId">;

// Params to find a note by its public ID and user ID (for authorization)
export type FindNoteDALRequest = Pick<Note, "publicId" | "userId">;

export type GetNotesDALRequest = Pick<Note, "userId">;

// Only user-editable fields; updatedAt is set by the DAL, status is not updatable via this path
export type UpdateNoteDALRequest = FindNoteDALRequest &
  NullableDALFields<Pick<Note, "title" | "body">>;
