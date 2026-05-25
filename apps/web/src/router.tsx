import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { createQueryClient } from "./providers/queryClient";
import {
  QueryClientProvider,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export function getRouter() {
  return createRouter();
}

export function createRouter() {
  const queryClient = createQueryClient();

  return createTanStackRouter({
    routeTree,
    context: { queryClient },
    Wrap: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {children}
        </HydrationBoundary>
      </QueryClientProvider>
    ),
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
