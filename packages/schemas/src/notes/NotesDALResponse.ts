import type { ApiResponse } from "../common";
import type { Note } from "./NotesCommon";

// DEV_NOTE: DAL responses carry raw DB rows (status as int, internal id included).
// The Repo maps them to the API shapes in NotesApiResponse.ts.

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
