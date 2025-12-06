import { Institute } from "./institute";
//import { Team } from "./team";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  role: string;
  profile_image_url: string | null;
  matches_officiated: number;
  created_at: string;
  updated_at: string;
  institute_id: string | null;
  game_categories: string[] | null;
  team_id: string | null;
  scanner_code_url?: string;
  institute_details: Institute | null;
 // team_details: Omit<Team, "instituteDetails"> | null;
  extra_user_details: ExtraUserDetail[] | null;
}

export interface ExtraUserDetail {
  id: string;
  name: string;
  age: number;
  height: number;
  weight: number;
  sport: string;
  date: string;
  agility_test_trial1: number;
  agility_test_trial2: number;
  agility_test_trial3: number;
  best_of_3_in_agility_test: number;
  iso_belt_squat_trial1: number;
  iso_belt_squat_trial2: number;
  iso_belt_squat_trial3: number;
  best_of_3_in_iso_belt_squat: number;
  mb_throw_trial1: number;
  mb_throw_trial2: number;
  mb_throw_trial3: number;
  best_of_3_in_mb_throw: number;
  squat_jump_trial1: number;
  squat_jump_trial2: number;
  squat_jump_trial3: number;
  best_of_3_in_squat_jump: number;
  vertical_jump_trial1: number;
  vertical_jump_trial2: number;
  vertical_jump_trial3: number;
  best_of_3_in_vertical_jump: number;
  ten_meter_speed_trial1: number;
  ten_meter_speed_trial2: number;
  ten_meter_speed_trial3: number;
  best_of_3_in_ten_meter_speed: number;
}
