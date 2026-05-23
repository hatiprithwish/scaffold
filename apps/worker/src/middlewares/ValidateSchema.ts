import { zValidator } from "@hono/zod-validator";
import type { Context, Next } from "hono";
import type { z } from "zod";

type ValidateSchemaOptions = {
  query?: string[];
  params?: string[];
};

type MiddlewareFn = (c: Context, next: Next) => Promise<Response | void>;

const missingFieldsResponse = (c: Context, type: string, missing: string[]) =>
  c.json(
    {
      isSuccess: false,
      message: `${type} validation failed`,
      details: { missing },
    },
    400,
  );

// Use directly as a route arg so Hono can thread the validated type to c.req.valid("json")
export const bodyValidator = <T extends z.ZodTypeAny>(schema: T) =>
  zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          isSuccess: false,
          message: "Request body validation failed",
          details: result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        400,
      );
    }
  });

const validateSchema = (options: ValidateSchemaOptions): MiddlewareFn[] => {
  const middlewares: MiddlewareFn[] = [];

  if (options.query?.length) {
    middlewares.push(async (c, next) => {
      const searchParams = new URL(c.req.url).searchParams;
      const missing = options.query!.filter(
        (k) => !searchParams.has(k) || searchParams.get(k) === "",
      );
      if (missing.length)
        return missingFieldsResponse(c, "Query parameters", missing);
      await next();
    });
  }

  if (options.params?.length) {
    middlewares.push(async (c, next) => {
      const missing = options.params!.filter(
        (k) => !c.req.param(k) || c.req.param(k) === "",
      );
      if (missing.length)
        return missingFieldsResponse(c, "Route params", missing);
      await next();
    });
  }

  return middlewares;
};

export default validateSchema;
