import { Hono } from "hono";
import AuthRepo from "@/repositories/AuthRepo";
import checkAuth from "@/middlewares/AuthMiddleware";
import { UserRoleEnum } from "@scaffold/schemas";

const AuthRoutes = new Hono<{ Bindings: Env }>();

AuthRoutes.post("/clerk-sync", checkAuth, async (c) => {
  const clerkId = c.get("clerkUserId");
  const email = c.get("clerkEmail");

  const repo = new AuthRepo(c.env);
  const user = await repo.syncClerkUser({
    clerkId,
    email,
    role: UserRoleEnum.User,
  });

  return c.json(user, 200);
});

export default AuthRoutes;
