import type * as Schemas from "@app/schemas";

export type GetTokenFn = () => Promise<string | null>;

export type ApiClientFn = <T>(
  path: string,
  getToken: GetTokenFn | null,
  options?: RequestInit & { signal?: AbortSignal },
) => Promise<T>;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: Schemas.ApiResponse,
  ) {
    super(body.message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

// DEV_NOTE: Returns a bound apiClient tied to a base URL. Call once per app entry point, not per request.
export function createApiClient(baseUrl: string): ApiClientFn {
  return async function apiClient<T>(
    path: string,
    getToken: GetTokenFn | null,
    options?: RequestInit & { signal?: AbortSignal },
  ): Promise<T> {
    const token = getToken ? await getToken() : null;

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      signal: options?.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    const body = (await res.json()) as T & Schemas.ApiResponse;

    if (!res.ok || !body.isSuccess) {
      throw new ApiError(res.status, body as Schemas.ApiResponse);
    }

    return body;
  };
}
