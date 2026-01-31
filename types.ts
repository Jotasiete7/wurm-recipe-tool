export interface Recipe {
  name: string;
  skill: string;
  container: string;
  cooker: string;
  mandatory: string;
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
