import { User } from "./UsersCommon";
import { ApiResponse } from "../common";

export type SyncClerkUserApiResponse = ApiResponse<User>;

export type GetUserDetailsApiResponse = ApiResponse<User>;

export type UpdateUserApiResponse = ApiResponse<User>;
