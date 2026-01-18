import { Language } from '../types';

interface TranslationData {
  ui: {
    portal: string;
    recipes: string;
    ecosystem: string;
    mainSite: string;
    miningTool: string;
    recipeGuide: string;
    introTitle: string;
    introSubtitle: string;
    filters: string;
    reset: string;
    searchPlaceholder: string;
    skillLabel: string;
    containerLabel: string;
    cookerLabel: string;
    skillDist: string;
    totalRecipes: string;
    foundRecipes: string;
    noRecipes: string;
    tryAdjust: string;
    clearFilters: string;
    ingredients: string;
    noIngredients: string;
    skillCategory: string;
    allSkills: string;
    allContainers: string;
    allCookers: string;
  };
  skills: Record<string, string>;
}

export const TRANSLATIONS: Record<Language, TranslationData> = {
  en: {
    ui: {
      portal: "Portal",
      recipes: "Recipes",
      ecosystem: "Ecosystem",
      mainSite: "Main Site",
      miningTool: "Mining Tool",
      recipeGuide: "Recipe Guide",
      introTitle: "Culinaria",
      introSubtitle: "recipes. Filter by skill, container, or ingredients to optimize your cooking.",
      filters: "Filters",
      reset: "Reset",
      searchPlaceholder: "Search name or ingredient...",
      skillLabel: "Skill",
      containerLabel: "Container",
      cookerLabel: "Cooker",
      skillDist: "Skill Distribution",
      totalRecipes: "Total Recipes",
      foundRecipes: "Found",
      noRecipes: "No recipes found",
      tryAdjust: "Try adjusting your search criteria",
      clearFilters: "Clear Filters",
      ingredients: "Required Ingredients",
      noIngredients: "No specific mandatory ingredients listed.",
      skillCategory: "Skill Category",
      allSkills: "All Skills",
      allContainers: "All Containers",
      allCookers: "All Cookers"
    },
    skills: {
      "Hot Food Cooking": "Hot Food Cooking",
      "Baking": "Baking",
      "Beverages": "Beverages",
      "Cooking": "Cooking",
      "Dairy Food Making": "Dairy Food Making",
      "Milling": "Milling",
      "Butchering": "Butchering"
    }
  },
  pt: {
    ui: {
      portal: "Portal",
      recipes: "Receitas",
      ecosystem: "Ecossistema",
      mainSite: "Site Principal",
      miningTool: "Ferramenta de Mineração",
      recipeGuide: "Guia de Receitas",
      introTitle: "Culinária",
      introSubtitle: "receitas. Filtre por habilidade, recipiente ou ingredientes para otimizar.",
      filters: "Filtros",
      reset: "Limpar",
      searchPlaceholder: "Buscar nome ou ingrediente...",
      skillLabel: "Habilidade",
      containerLabel: "Recipiente",
      cookerLabel: "Cozinador",
      skillDist: "Distribuição",
      totalRecipes: "Total de Receitas",
      foundRecipes: "Encontradas",
      noRecipes: "Nenhuma receita encontrada",
      tryAdjust: "Tente ajustar seus critérios de busca",
      clearFilters: "Limpar Filtros",
      ingredients: "Ingredientes Obrigatórios",
      noIngredients: "Nenhum ingrediente obrigatório listado.",
      skillCategory: "Categoria da Habilidade",
      allSkills: "Todas Habilidades",
      allContainers: "Todos Recipientes",
      allCookers: "Todos Cozinadores"
    },
    skills: {
      "Hot Food Cooking": "Culinária Quente",
      "Baking": "Panificação",
      "Beverages": "Bebidas",
      "Cooking": "Cozinha Básica",
      "Dairy Food Making": "Laticínios",
      "Milling": "Moagem",
      "Butchering": "Açougue"
    }
  },
  ru: {
    ui: {
      portal: "Портал",
      recipes: "Рецепты",
      ecosystem: "Экосистема",
      mainSite: "Главная",
      miningTool: "Инструмент майнинга",
      recipeGuide: "Гайд по рецептам",
      introTitle: "Кулинария",
      introSubtitle: "рецептов. Фильтруйте по навыкам, посуде или ингредиентам.",
      filters: "Фильтры",
      reset: "Сброс",
      searchPlaceholder: "Поиск названия или ингредиента...",
      skillLabel: "Навык",
      containerLabel: "Контейнер",
      cookerLabel: "Плита",
      skillDist: "Распределение навыков",
      totalRecipes: "Всего рецептов",
      foundRecipes: "Найдено",
      noRecipes: "Рецепты не найдены",
      tryAdjust: "Попробуйте изменить критерии поиска",
      clearFilters: "Очистить фильтры",
      ingredients: "Необходимые ингредиенты",
      noIngredients: "Обязательные ингредиенты не указаны.",
      skillCategory: "Категория навыка",
      allSkills: "Все навыки",
      allContainers: "Все контейнеры",
      allCookers: "Все плиты"
    },
    skills: {
      "Hot Food Cooking": "Горячая пища",
      "Baking": "Выпечка",
      "Beverages": "Напитки",
      "Cooking": "Кулинария",
      "Dairy Food Making": "Молочные продукты",
      "Milling": "Помол",
      "Butchering": "Разделка"
    }
  }
};

export const translateSkill = (skill: string, lang: Language): string => {
  // Try to find the skill in the dictionary, fallback to English/Original
  const dict = TRANSLATIONS[lang].skills;
  return dict[skill] || skill;
};