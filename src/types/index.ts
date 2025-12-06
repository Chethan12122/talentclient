//import { Event, CreateEventRequest, UpdateEventRequest, EVENT_TYPE } from "./event";
//import { League, LeagueRequest, LEAGUE_STATUS } from "./league";
import { User } from "./user";

export interface LoginResponse {
  data: {
    session: {
      access_token: string;
      refresh_token: string;
    };
    user_details: User[];
  };
}

export interface LogoutResponse {
  message: string;
}

export type ErrorResponse = {
  message: string;
};

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface UserApiResponse {
  data: User[];
  message: string;
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

// // Re-export league types
// export type { League, LeagueRequest };
// export { LEAGUE_STATUS };

// // Re-export event types
// export type { Event, CreateEventRequest, UpdateEventRequest };
// export { EVENT_TYPE };
