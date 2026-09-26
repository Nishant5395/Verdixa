import { isAxiosError } from "axios";

/** Pulls a human-readable message out of an API error without needing `any`. */
export function errorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message || error.message || fallback;
  }
  return error instanceof Error ? error.message : fallback;
}
