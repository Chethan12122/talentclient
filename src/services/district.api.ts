import { ApiError } from "@/types/auth.types";

// Fixed: ID field should be 'id', not 'district_id'
export type District = {
  id: string;  // Changed from district_id
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DistrictResponse {
  data: District[];
  message: string;
}

export async function fetchDistricts(): Promise<DistrictResponse> {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new ApiError("API base URL is not configured");
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/district`;

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
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(errorData.message || "Failed to fetch districts", response.status);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "Failed to fetch districts");
  }
}

export async function fetchDistrictById(districtId: string): Promise<{ data: District; message: string }> {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new ApiError("API base URL is not configured");
  }
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/district/${districtId}`;

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
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(errorData.message || "Failed to fetch district", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "Failed to fetch district");
  }
}