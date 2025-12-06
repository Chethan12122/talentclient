// src/types/auth.types.ts
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  role: "ATHLETE" | "REFEREE" | "TEAM MANAGER";
  institute_id: string;
  district_id: string;  
}

export type VerifyRequest =
  | { token: string }
  | { email: string; code: string }

export interface LoginRequest {
  email: string;
  password: string;
  source: "ADMIN" | "APP";
}

export interface LoginResponse {
  data: {
    access_token?: string;
    refresh_token?: string;
    user?: {
      id: string;
      email: string;
      role?: "ATHLETE" | "REFEREE" | "TEAM MANAGER" | "authenticated";
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      name?: string;
      email_confirmed_at?: string;
      created_at?: string;
      updated_at?: string;
      [key: string]: any;
    };
    session?: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      expires_at: number;
      token_type: string;
      user: any;
    };
    user_details?: Array<{
      user_id: string;
      first_name: string;
      last_name: string;
      phone_number: string;
      role: "ATHLETE" | "REFEREE" | "TEAM MANAGER";
      email: string;
      [key: string]: any;
    }>;
  };
  message: string;
}

export interface RegisterResponse {
  message: string;
  data?: {
    user?: any;
    verification_required?: boolean;
  };
}

export interface VerifyResponse {
  data: {
    access_token?: string;
    refresh_token?: string;
    user?: any;
    session?: any;
  };
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RefreshTokenResponse {
  data: {
    access_token: string;
    refresh_token: string;
    user?: any;
  };
  message: string;
}

export interface UserProfileResponse {
  data: {
    id: string;
    email: string;
    role: "ATHLETE" | "REFEREE" | "TEAM MANAGER";
    first_name: string;
    last_name: string;
    phone_number: string;
    name: string;
    email_confirmed_at: string;
    created_at: string;
    updated_at: string;
    [key: string]: any;
  };
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirm_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "ApiError";
  }
}
