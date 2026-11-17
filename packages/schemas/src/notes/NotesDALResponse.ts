import type { ApiResponse } from "../common";
import type { Note } from "./NotesCommon";

// DAL responses carry raw DB rows (status as int, includes internal id).
// The Repo maps these to NoteWithStatus before they reach a client.
export interface CreateNoteDALResponse extends ApiResponse {
  note?: Note;
}

export interface GetNoteDALResponse extends ApiResponse {
  note?: Note;
}

export interface GetNotesDALResponse extends ApiResponse {
  notes?: Note[];
}

export interface UpdateNoteDALResponse extends ApiResponse {
  note?: Note;
}
