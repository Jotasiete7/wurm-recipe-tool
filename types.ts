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
