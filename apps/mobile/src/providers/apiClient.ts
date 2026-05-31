import { createApiClient, ApiError } from "@app/api-client";

export { ApiError };
export const apiClient = createApiClient(process.env.EXPO_PUBLIC_API_URL!);
