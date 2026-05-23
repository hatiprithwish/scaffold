import { ClerkClient, createClerkClient } from "@clerk/backend";

let clerkClient: ClerkClient | undefined;

export default class ClerkProvider {
  static getClerkClient(env: Env): ClerkClient {
    if (!clerkClient) {
      clerkClient = createClerkClient({
        publishableKey: env.CLERK_PUBLISHABLE_KEY,
        secretKey: env.CLERK_SECRET_KEY,
        jwtKey: env.CLERK_JWT_KEY,
      });
    }
    return clerkClient;
  }
}
