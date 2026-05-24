export interface ApiResponse<T = unknown> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

export type NullableDALFields<T> = {
  [K in keyof T]: T[K] | null;
};
