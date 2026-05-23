import { UserRoleEnum } from "./AuthCommon";

export interface SyncClerkUserDALRequest {
  clerkId: string;
  email: string;
  role: UserRoleEnum;
}
