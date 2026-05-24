import { Hono } from "hono";
import UsersRepo from "@/repositories/UsersRepo";
import checkAuth from "@/middlewares/AuthMiddleware";
import AppContext from "@/config/AppContext";
import { bodyValidator } from "@/middlewares/ValidateSchema";
import { UserRoleEnum, ZUpdateUserApiRequest } from "@scaffold/schemas";

const UsersRoutes = new Hono<AppContext>();

UsersRoutes.post("/clerk-sync", checkAuth, async (c) => {
  const clerkId = c.get("clerkUserId");
  const email = c.get("clerkEmail");

  const repo = new UsersRepo(c.env);
  const response = await repo.syncClerkUser({
    clerkId,
    email,
    role: UserRoleEnum.User,
  });

  return c.json(response, response.isSuccess ? 200 : 500);
});

UsersRoutes.get("/me", checkAuth, async (c) => {
  const clerkId = c.get("clerkUserId");

  const repo = new UsersRepo(c.env);
  const response = await repo.getUserDetails({ clerkId });

  return c.json(response, response.isSuccess ? 200 : 404);
});

UsersRoutes.patch(
  "/me",
  checkAuth,
  bodyValidator(ZUpdateUserApiRequest),
  async (c) => {
    const clerkId = c.get("clerkUserId");
    const body = c.req.valid("json");

    const repo = new UsersRepo(c.env);
    const response = await repo.updateUser({ ...body, clerkId });

    return c.json(response, response.isSuccess ? 200 : 500);
  },
);

export default UsersRoutes;
