import type { ApiResponse } from "@schemas/common";

const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiResponse<never>,
  ) {
    super(body.message ?? `API error ${status}`);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  path: string,
  getToken: (() => Promise<string | null>) | null,
  options?: RequestInit & { signal?: AbortSignal },
): Promise<T> {
  const token = getToken ? await getToken() : null;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    signal: options?.signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !body.isSuccess) {
    throw new ApiError(res.status, body as ApiResponse<never>);
  }

  return body.data as T;
}
