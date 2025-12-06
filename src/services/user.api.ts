import apiClient from "@/lib/interceptor";
import { UserApiResponse } from "../types";

export const getUserById = async (userId: string): Promise<UserApiResponse> => {
  try {
    const response = await apiClient.get(`/user/${userId}?type=user_id`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with id ${userId}:`, error);
    throw error;
  }
};

export const getUserByRole = async (role: string): Promise<UserApiResponse> => {
  try {
    const response = await apiClient.get(`/user/${role}?type=role`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with id ${role}:`, error);
    throw error;
  }
};

export const getUsersByInstitute = async (instituteID: string): Promise<UserApiResponse> => {
  try {
    const response = await apiClient.get(`/user/${instituteID}?type=institute_id`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with id ${instituteID}:`, error);
    throw error;
  }
};

export const syncUserSheet = async (): Promise<any> => {
  try {
    const response = await apiClient.get("/user/sync/sheet");
    return response.data;
  } catch (error) {
    console.error("Error syncing user sheet:", error);
    throw error;
  }
};

export const addUserGameCategory = async (userId: string, gameCategoryId: string) => {
  try {
    const response = await apiClient.post(`/user/${userId}/game_category/${gameCategoryId}?type=add`);
    return response.data;
  } catch (error) {
    console.error("Error adding game category to user:", error);
    throw error;
  }
};

export const removeUserGameCategory = async (userId: string, gameCategoryId: string) => {
  try {
    const response = await apiClient.post(`/user/${userId}/game_category/${gameCategoryId}?type=remove`);
    return response.data;
  } catch (error) {
    console.error("Error removing game category from user:", error);
    throw error;
  }
};
