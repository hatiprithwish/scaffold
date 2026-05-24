import { Note } from "./NotesCommon";
import { ApiResponse } from "../common";

export interface CreateNoteApiResponse extends ApiResponse {
  note?: Note;
}

export interface GetNoteApiResponse extends ApiResponse {
  note?: Note;
}

export interface GetNotesApiResponse extends ApiResponse {
  notes?: Note[];
}

export interface UpdateNoteApiResponse extends ApiResponse {
  note?: Note;
}
