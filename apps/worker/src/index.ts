import { honoLogger } from "@logtape/hono";
import { Hono } from "hono";
import { requestId } from "hono/request-id";
import {
  configureLogger,
  disposeLogger,
  withRequestContext,
} from "@/providers/logger";
import UsersRoutes from "@/routes/UserRoutes";
import NotesRoutes from "@/routes/NotesRoutes";
import * as Schemas from "@app/schemas";
import Constants from "@/config/Constants";

// DEV_NOTE: Configure logger at the top level to ensure it's ready before handling any requests.
await configureLogger();

const app = new Hono<{ Bindings: Env }>();

app.use(requestId({ headerName: "x-request-id" }));

app.use(async (c, next) => {
  await withRequestContext(c.get("requestId"), next);
});

app.use(
  honoLogger({
    category: [Constants.APP_NAME, Schemas.LogCategory.Middleware],
    level: "info",
  }),
);

app.route("/users", UsersRoutes);
app.route("/notes", NotesRoutes);

export default {
  fetch(req: Request, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(disposeLogger());
    return app.fetch(req, env, ctx);
  },
};
