import { z } from "zod";
import { UserBase, ZUserRoleEnum } from "./UsersCommon";

export type SyncClerkUserApiRequest = UserBase;

export const ZUpdateUserApiRequest = z.object({
  email: z.string().optional(),
  role: ZUserRoleEnum.optional(),
});

export type UpdateUserApiRequest = z.infer<typeof ZUpdateUserApiRequest>;
