export interface Institute {
  institute_id: string;
  name: string;
  district_id: string;
  district?: {
    id?: string;
    district_id?: string;
    name: string;
  };
  district_details?: {
    id: string;
    name: string;
    created_at?: string;
    updated_at?: string;
  };
  created_at?: string;
  updated_at?: string;
}