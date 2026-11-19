// DEV_NOTE: The SHARED web data layer: queries and mutations used by more than one route or by the app shell (the
// signed-in user, here). A route's own data stays in its `-data.ts` (see notes/-data.ts). Same shape as a `-data.ts`:
// a Queries class with hierarchical keys, one hook per mutation, a non-empty onError on every mutation.
import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/tanstack-react-start";
import * as Sentry from "@sentry/tanstackstart-react";
import type * as Schemas from "@app/schemas";
import { apiClient } from "@/providers/apiClient";

export class UsersQueries {
  // DEV_NOTE: Keys form a hierarchy — me extends all. Invalidating all() clears every user query.
  static readonly keys = {
    all: () => ["users"] as const,
    me: () => ["users", "me"] as const,
  };

  // DEV_NOTE: The signed-in user's own row (any route may read it: a header, settings, a feature's defaults)
  static me(getToken: () => Promise<string | null>) {
    return queryOptions({
      queryKey: UsersQueries.keys.me(),
      queryFn: ({ signal }) =>
        apiClient<Schemas.GetUserDetailsApiResponse>("/users/me", getToken, { signal }),
    });
  }
}

// DEV_NOTE: Makes sure the signed-in Clerk user has a users row (the authenticated layout calls it once per session).
// A failure is not shown to the user: the row usually exists already and the server logs why; it goes to Sentry so a
// real outage is still seen.
export function useSyncClerkUser() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<Schemas.SyncClerkUserApiResponse>("/users/clerk-sync", getToken, {
        method: "POST",
      }),
    onSuccess: (response) => {
      if (response.user) queryClient.setQueryData(UsersQueries.keys.me(), response);
    },
    onError: (error) => {
      Sentry.captureException(error);
    },
  });
}
