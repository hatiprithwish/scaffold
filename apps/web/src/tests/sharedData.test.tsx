import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UsersQueries, useSyncClerkUser } from "@/data";

const { mockApiClient, mockCapture } = vi.hoisted(() => ({
  mockApiClient: vi.fn(),
  mockCapture: vi.fn(),
}));

vi.mock("@/providers/apiClient", () => ({
  apiClient: (...args: unknown[]) => mockApiClient(...args),
}));

vi.mock("@clerk/tanstack-react-start", () => ({
  useAuth: () => ({ getToken: vi.fn().mockResolvedValue("token") }),
}));

vi.mock("@sentry/tanstackstart-react", () => ({ captureException: mockCapture }));

let queryClient: QueryClient;

function wrapper({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  mockApiClient.mockReset();
  mockCapture.mockReset();
});

// DEV_NOTE: The shared data layer (src/data/index.ts): the signed-in user, read by the app shell and any route
describe("useSyncClerkUser", () => {
  it("posts clerk-sync and caches the user as me", async () => {
    const response = { isSuccess: true, user: { publicId: "u_1" } };
    mockApiClient.mockResolvedValue(response);

    const { result } = renderHook(() => useSyncClerkUser(), { wrapper });
    await result.current.mutateAsync();

    expect(mockApiClient).toHaveBeenCalledWith("/users/clerk-sync", expect.any(Function), {
      method: "POST",
    });
    expect(queryClient.getQueryData(UsersQueries.keys.me())).toEqual(response);
  });

  it("reports a failure to Sentry instead of showing it", async () => {
    const error = new Error("down");
    mockApiClient.mockRejectedValue(error);

    const { result } = renderHook(() => useSyncClerkUser(), { wrapper });
    result.current.mutate();

    await waitFor(() => expect(mockCapture).toHaveBeenCalledWith(error));
  });
});
