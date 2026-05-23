import { Hono } from "hono";
import AuthRepo from "@/repositories/AuthRepo";
import checkAuth from "@/middlewares/AuthMiddleware";
import AppContext from "@/config/AppContext";
import { bodyValidator } from "@/middlewares/ValidateSchema";
import { UserRoleEnum, ZUpdateUserApiRequest } from "@scaffold/schemas";

const AuthRoutes = new Hono<AppContext>();

AuthRoutes.post("/clerk-sync", checkAuth, async (c) => {
  const clerkId = c.get("clerkUserId");
  const email = c.get("clerkEmail");

  const repo = new AuthRepo(c.env);
  const response = await repo.syncClerkUser({
    clerkId,
    email,
    role: UserRoleEnum.User,
  });

  return c.json(response, response.isSuccess ? 200 : 500);
});

AuthRoutes.patch(
  "/me",
  checkAuth,
  bodyValidator(ZUpdateUserApiRequest),
  async (c) => {
    const clerkId = c.get("clerkUserId");
    const body = c.req.valid("json");

    const repo = new AuthRepo(c.env);
    const response = await repo.updateUser({ ...body, clerkId });

    return c.json(response, response.isSuccess ? 200 : 404);
  },
);

export default AuthRoutes;
