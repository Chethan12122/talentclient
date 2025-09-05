import { deleteCookie, getCookie, setCookie } from "cookies-next";
import apiClient from "@/lib/interceptor";

// Types matching your backend
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: "ATHLETE" | "REFEREE" | "TEAM MANAGER";
  institute_id: string;
}

export interface VerifyRequest {
  phone_number: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  source: "ADMIN" | "USER";
}

export interface LoginResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user?: any;
  };
  message: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyResponse {
  data: any;
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}

// Register function
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  console.log("Register function called with data:", data);
  
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;
  console.log("Making request to:", apiUrl);
  
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not defined!");
    throw new ApiError("API URL is not configured");
  }
  
  try {
    console.log("Sending fetch request...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log("Response received:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error("Error response data:", errorData);
      } catch (e) {
        console.error("Failed to parse error response as JSON:", e);
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(errorData.message || "Registration failed", response.status);
    }

    const result = await response.json();
    console.log("Registration successful, response:", result);
    return result;
  } catch (error) {
    console.error("Register function error:", error);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Check for network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError("Network error - please check your connection and API URL");
    }
    
    throw new ApiError(error instanceof Error ? error.message : "Registration failed");
  }
}

// Verify function
export async function verify(data: VerifyRequest): Promise<VerifyResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Verification failed", response.status);
    }

    const result = await response.json();
    
    // Store tokens if provided
    if (result.data?.access_token) {
      setCookie("access_token", result.data.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    
    if (result.data?.refresh_token) {
      setCookie("refresh_token", result.data.refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Verification failed");
  }
}

// Login function
export async function login(email: string, password: string, source: "ADMIN" | "USER" = "USER"): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        source,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Login failed", response.status);
    }

    const result = await response.json();
    
    // Store tokens
    if (result.data?.access_token) {
      setCookie("access_token", result.data.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    
    if (result.data?.refresh_token) {
      setCookie("refresh_token", result.data.refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Login failed");
  }
}

// Logout function
export async function logout(): Promise<LogoutResponse> {
  const refreshToken = getCookie("refresh_token");

  try {
    const response = await apiClient.post("/auth/logout", {
      refresh_token: refreshToken,
    });

    deleteCookie("access_token");
    deleteCookie("refresh_token");

    return response.data;
  } catch (error) {
    // Still clear cookies even if API call fails
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    
    console.error("Error logging out:", error);
    throw new ApiError(error instanceof Error ? error.message : "Failed to logout");
  }
}

// Refresh token function
export async function refreshToken(): Promise<{ access_token: string; refresh_token: string }> {
  const currentRefreshToken = getCookie("refresh_token");

  if (!currentRefreshToken) {
    throw new ApiError("No refresh token available");
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: currentRefreshToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Token refresh failed", response.status);
    }

    const result = await response.json();
    
    // Update stored tokens
    if (result.data?.access_token) {
      setCookie("access_token", result.data.access_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }
    
    if (result.data?.refresh_token) {
      setCookie("refresh_token", result.data.refresh_token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Token refresh failed");
  }
}