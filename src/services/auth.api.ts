import { deleteCookie, getCookie, setCookie } from "cookies-next";
import apiClient from "@/lib/interceptor";
import type {
  RegisterRequest,
  VerifyRequest,
  LoginRequest,
  LoginResponse,
  RegisterResponse,
  VerifyResponse,
  LogoutResponse,
  RefreshTokenResponse,
  UserProfileResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/types/auth.types";

import { ApiError } from "@/types/auth.types";


// Dashboard path mapping
export const DASHBOARD_PATHS = {
  ATHLETE: "/dashboard/athlete",
  REFEREE: "/dashboard/referee",
  "TEAM MANAGER": "/dashboard/teammanager"
} as const;

// Helper function to get dashboard path based on role
export function getDashboardPath(role: "ATHLETE" | "REFEREE" | "TEAM MANAGER"): string {
  const path = DASHBOARD_PATHS[role];
  return path || "/dashboard";
}

// Helper function to extract user role from login response
export function extractUserRoleFromResponse(response: LoginResponse): "ATHLETE" | "REFEREE" | "TEAM MANAGER" | null {
  const roleFromDetails = response.data?.user_details?.[0]?.role;
  if (roleFromDetails && ["ATHLETE", "REFEREE", "TEAM MANAGER"].includes(roleFromDetails)) {
    return roleFromDetails as "ATHLETE" | "REFEREE" | "TEAM MANAGER";
  }

  const roleFromUser = response.data?.user?.role;
  if (roleFromUser && ["ATHLETE", "REFEREE", "TEAM MANAGER"].includes(roleFromUser)) {
    return roleFromUser as "ATHLETE" | "REFEREE" | "TEAM MANAGER";
  }

  return null;
}

// Helper function to safely get cookies
function getCookieValue(key: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  try {
    const cookie = getCookie(key);
    return cookie ? String(cookie) : undefined;
  } catch (error) {
    console.error(`Error getting cookie ${key}:`, error);
    return undefined;
  }
}

// Helper function to set authentication cookies
function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24, // 24 hours
  };

  setCookie("access_token", accessToken, cookieOptions);
  setCookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7, // 7 days for refresh token
  });
}

// Helper function to clear authentication cookies
function clearAuthCookies() {
  const cookieOptions = {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  deleteCookie("access_token", cookieOptions);
  deleteCookie("refresh_token", cookieOptions);
  deleteCookie("user_role", cookieOptions);
  deleteCookie("user_id", cookieOptions);
}

// Type guard for axios errors
function isAxiosError(error: unknown): error is { 
  code?: string; 
  message?: string; 
  response?: { status?: number; data?: any } 
} {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// Register function
export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;

  if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
    throw new ApiError("API URL is not configured");
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
      }
      throw new ApiError(errorData.message || "Registration failed", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError("Network error - please check your connection and API URL");
    }

    throw new ApiError(error instanceof Error ? error.message : "Registration failed");
  }
}

// Email verification function
export async function verifyEmail(data: VerifyRequest): Promise<VerifyResponse> {
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

    if (result.data?.access_token && result.data?.refresh_token) {
      setAuthCookies(result.data.access_token, result.data.refresh_token);
    }

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Verification failed");
  }
}

// Resend verification email function
export async function resendVerificationEmail(email: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Failed to resend verification email", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Failed to resend verification email");
  }
}

// Login function
export async function login(
  email: string,
  password: string,
  source: "ADMIN" | "APP" = "APP"
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        source: source || "APP",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Login failed", response.status);
    }

    const result = await response.json();

    // Extract tokens from the nested session object
    if (result.data?.session?.access_token && result.data?.session?.refresh_token) {
      setAuthCookies(
        result.data.session.access_token, 
        result.data.session.refresh_token
      );
    }

    // Store user role from user_details
    const userRole = extractUserRoleFromResponse(result);
    if (userRole) {
      setCookie("user_role", userRole, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    // Store user_id from user_details if available
    const userId = result.data?.user_details?.[0]?.user_id;
    if (userId) {
      setCookie("user_id", userId, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
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

// Logout function with enhanced error handling
export async function logout(): Promise<LogoutResponse> {
  try {
    const refreshTokenValue = getCookieValue("refresh_token");
    const accessTokenValue = getCookieValue("access_token");

    if (!refreshTokenValue || !accessTokenValue) {
      clearAuthCookies();
      return { message: "No active session found" };
    }

    // Validate JWT format
    let shouldRefreshToken = false;
    
    try {
      const tokenParts = accessTokenValue.split('.');
      if (tokenParts.length !== 3) {
        clearAuthCookies();
        return { message: "Invalid session format" };
      }

      // Decode with proper padding
      const base64Payload = tokenParts[1];
      const paddedPayload = base64Payload + '='.repeat(4 - base64Payload.length % 4);
      const tokenPayload = JSON.parse(atob(paddedPayload));
      
      const currentTime = Math.floor(Date.now() / 1000);
      const isExpired = tokenPayload.exp < currentTime;
      
      if (isExpired) {
        shouldRefreshToken = true;
      }
    } catch (tokenDecodeError) {
      shouldRefreshToken = true;
    }

    // Handle token refresh if needed
    if (shouldRefreshToken) {
      try {
        await refreshToken();
        const newAccessToken = getCookieValue("access_token");
        if (newAccessToken) {
          return await performLogoutRequest(newAccessToken, refreshTokenValue);
        }
      } catch (refreshError) {
        clearAuthCookies();
        return { message: "Session expired, logged out locally" };
      }
    }

    return await performLogoutRequest(accessTokenValue, refreshTokenValue);
  } catch (error: unknown) {
    clearAuthCookies();
    return { message: "Logged out locally" };
  }
}

// Separate function for the actual logout API call
async function performLogoutRequest(accessToken: string, refreshToken: string): Promise<LogoutResponse> {
  try {
    const response = await apiClient.post(
      "/auth/logout",
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000,
      }
    );

    clearAuthCookies();
    return response.data;
  } catch (error: unknown) {
    // Check error type safely
    if (isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
        console.log("Logout request timed out, clearing cookies locally");
      } else if (error.response?.status === 401) {
        console.log("Unauthorized logout, clearing cookies locally");
      }
    }
    
    clearAuthCookies();
    return { message: "Logged out locally" };
  }
}

// Refresh token function
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const currentRefreshToken = getCookieValue("refresh_token");

  if (!currentRefreshToken) {
    throw new ApiError("No refresh token available", 401);
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
      clearAuthCookies();
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Token refresh failed", response.status);
    }

    const result = await response.json();

    if (result.data?.access_token && result.data?.refresh_token) {
      setAuthCookies(result.data.access_token, result.data.refresh_token);
    }

    return result;
  } catch (error) {
    clearAuthCookies();
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Token refresh failed");
  }
}

// Get user profile function
export async function getUserProfile(userId?: string): Promise<UserProfileResponse> {
  try {
    const token = getCookieValue("access_token");
    if (!token) {
      throw new ApiError("No access token found", 401);
    }

    const url = userId
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile/${userId}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        try {
          await refreshToken();
          const newToken = getCookieValue("access_token");
          if (!newToken) {
            throw new Error("No token after refresh");
          }
          
          const retryResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryResponse.ok) {
            throw new Error("Failed to fetch user profile after token refresh");
          }

          return await retryResponse.json();
        } catch (refreshError) {
          clearAuthCookies();
          throw new ApiError("Authentication expired. Please login again.", 401);
        }
      }

      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      throw new ApiError(errorData.message || "Failed to fetch user profile", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Failed to fetch user profile");
  }
}

// Get user role function
export async function getUserRole(): Promise<"ATHLETE" | "REFEREE" | "TEAM MANAGER" | null> {
  try {
    const token = getCookieValue("access_token");
    if (!token) {
      return null;
    }

    const storedRole = getCookieValue("user_role");
    if (storedRole && ["ATHLETE", "REFEREE", "TEAM MANAGER"].includes(storedRole)) {
      return storedRole as "ATHLETE" | "REFEREE" | "TEAM MANAGER";
    }

    // Fallback to API call
    try {
      const profile = await getUserProfile();
      const role = profile.data?.role;

      if (role) {
        setCookie("user_role", role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24,
        });
        return role;
      }
    } catch (profileError) {
      console.error("getUserRole API call failed:", profileError);
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = getCookieValue("access_token");
  return !!token;
}

// Get current user from stored token
export function getCurrentUser(): any {
  const token = getCookieValue("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Forgot password function
export async function forgotPassword(email: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Failed to send reset email", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Failed to send reset email");
  }
}

// Reset password function
export async function resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Password reset failed", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Password reset failed");
  }
}

// Change password function
export async function changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
  try {
    const token = getCookieValue("access_token");
    if (!token) {
      throw new ApiError("No access token found", 401);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Password change failed", response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Password change failed");
  }
}




// Reset password function


// Change password function (for authenticated users)


// Update user profile function
export async function updateUserProfile(data: Partial<UserProfileResponse['data']>): Promise<UserProfileResponse> {
  try {
    const token = getCookieValue("access_token");
    if (!token) {
      throw new ApiError("No access token found", 401);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Profile update failed", response.status);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Profile update failed");
  }
}

// Delete account function
export async function deleteAccount(): Promise<{ message: string }> {
  try {
    const token = getCookieValue("access_token");
    if (!token) {
      throw new ApiError("No access token found", 401);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/account`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(errorData.message || "Account deletion failed", response.status);
    }

    const result = await response.json();

    // Clear auth cookies after successful deletion
    clearAuthCookies();

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error instanceof Error ? error.message : "Account deletion failed");
  }
}