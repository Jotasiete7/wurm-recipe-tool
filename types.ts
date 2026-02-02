export interface Recipe {
  id?: string;
  name: string;
  skill: string;
  container: string;
  cooker: string;
  mandatory: string;
  difficulty?: number;
  status?: string;
  submitted_by?: string;
  screenshot_url?: string;
  created_at?: string;
  legacy_key?: string;
  source?: string;
  hint_en?: string;
  hint_pt?: string;
  hint_ru?: string;
}

export interface FilterState {
  search: string;
  skill: string;
  container: string;
  cooker: string;
}

export type Language = 'en' | 'pt' | 'ru';

export interface UsageStats {
  db_size_bytes: number;
  db_size_mb: number;
  recipes_count: number;
  limit_db_size_mb: number;
}
