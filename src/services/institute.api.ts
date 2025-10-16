import { ApiError } from "@/services/auth.api";

export async function fetchInstitutes() {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new ApiError("API base URL is not configured");
  }
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/institute`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(errorData.message || "Failed to fetch institutes", response.status);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "Failed to fetch institutes");
  }
}
