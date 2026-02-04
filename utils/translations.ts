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
    dailyChallenge: string;
    randomRecipe: string;
  };
  forms: {
    recipeName: string;
    recipeNamePlaceholder: string;
    skill: string;
    selectSkill: string;
    container: string;
    selectContainer: string;
    cooker: string;
    selectCooker: string;
    ingredients: string;
    addIngredient: string;
    ingredientNamePlaceholder: string;
    qtyPlaceholder: string;
    hintsTitle: string;
    hintEn: string;
    hintPt: string;
    hintRu: string;
    hintPlaceholderEn: string;
    hintPlaceholderPt: string;
    hintPlaceholderRu: string;
    proofScreenshot: string;
    chooseFile: string;
    screenshotHelp: string;
    submitterName: string;
    submitterNamePlaceholder: string;
    submitterNameHelp: string;
    processing: string;
    submitTitle: string;
    submitSubtitle: string;
    editTitle: string;
    editing: string;
    saveChanges: string;
    submitRecipe: string;
    successMessage: string;
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
      allCookers: "All Cookers",
      dailyChallenge: "Daily Challenge",
      randomRecipe: "Random Recipe"
    },
    forms: {
      recipeName: "Recipe Name *",
      recipeNamePlaceholder: "e.g., Bread",
      skill: "Skill *",
      selectSkill: "Select skill...",
      container: "Container *",
      selectContainer: "Select container...",
      cooker: "Cooker *",
      selectCooker: "Select cooker...",
      ingredients: "Ingredients *",
      addIngredient: "Add",
      ingredientNamePlaceholder: "Ingredient name",
      qtyPlaceholder: "Qty",
      hintsTitle: "Recipe Hints (Optional)",
      hintEn: "English Hint",
      hintPt: "Portuguese Hint",
      hintRu: "Russian Hint",
      hintPlaceholderEn: "e.g., Best made with high quality ingredients",
      hintPlaceholderPt: "e.g., Melhor feito com ingredientes de alta qualidade",
      hintPlaceholderRu: "e.g., Лучше всего готовить из качественных ингредиентов",
      proofScreenshot: "Proof Screenshot *",
      chooseFile: "Choose file...",
      screenshotHelp: "Upload a screenshot showing the recipe in-game",
      submitterName: "Your Name (Optional)",
      submitterNamePlaceholder: "e.g., YourIngameName",
      submitterNameHelp: "Optional: Your in-game name for credit",
      processing: "Processing...",
      submitTitle: "Submit New Recipe",
      submitSubtitle: "Share your recipe with the community",
      editTitle: "Edit Recipe",
      editing: "Editing:",
      saveChanges: "Save Changes",
      submitRecipe: "Submit Recipe",
      successMessage: "Recipe submitted successfully! It will be reviewed by admins."
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
      allCookers: "Todos Cozinadores",
      dailyChallenge: "Desafio Diário",
      randomRecipe: "Receita Aleatória"
    },
    forms: {
      recipeName: "Nome da Receita *",
      recipeNamePlaceholder: "ex: Pão",
      skill: "Habilidade *",
      selectSkill: "Selecione a habilidade...",
      container: "Recipiente *",
      selectContainer: "Selecione o recipiente...",
      cooker: "Cozinador *",
      selectCooker: "Selecione o cozinador...",
      ingredients: "Ingredientes *",
      addIngredient: "Adicionar",
      ingredientNamePlaceholder: "Nome do ingrediente",
      qtyPlaceholder: "Qtd",
      hintsTitle: "Dicas da Receita (Opcional)",
      hintEn: "Dica em Inglês",
      hintPt: "Dica em Português",
      hintRu: "Dica em Russo",
      hintPlaceholderEn: "ex: Best made with high quality ingredients",
      hintPlaceholderPt: "ex: Melhor feito com ingredientes de alta qualidade",
      hintPlaceholderRu: "ex: Лучше всего готовить из качественных ингредиентов",
      proofScreenshot: "Screenshot de Prova *",
      chooseFile: "Escolher arquivo...",
      screenshotHelp: "Envie uma screenshot mostrando a receita no jogo",
      submitterName: "Seu Nome (Opcional)",
      submitterNamePlaceholder: "ex: SeuNomeNoJogo",
      submitterNameHelp: "Opcional: Seu nome no jogo para créditos",
      processing: "Processando...",
      submitTitle: "Enviar Nova Receita",
      submitSubtitle: "Compartilhe sua receita com a comunidade",
      editTitle: "Editar Receita",
      editing: "Editando:",
      saveChanges: "Salvar Alterações",
      submitRecipe: "Enviar Receita",
      successMessage: "Receita enviada com sucesso! Será revisada pelos admins."
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
      allCookers: "Все плиты",
      dailyChallenge: "Ежедневное испытание",
      randomRecipe: "Случайный рецепт"
    },
    forms: {
      recipeName: "Название рецепта *",
      recipeNamePlaceholder: "например: Хлеб",
      skill: "Навык *",
      selectSkill: "Выберите навык...",
      container: "Контейнер *",
      selectContainer: "Выберите контейнер...",
      cooker: "Плита *",
      selectCooker: "Выберите плиту...",
      ingredients: "Ингредиенты *",
      addIngredient: "Добавить",
      ingredientNamePlaceholder: "Название ингредиента",
      qtyPlaceholder: "Кол-во",
      hintsTitle: "Подсказки (Опционально)",
      hintEn: "Подсказка на английском",
      hintPt: "Подсказка на португальском",
      hintRu: "Подсказка на русском",
      hintPlaceholderEn: "например: Best made with high quality ingredients",
      hintPlaceholderPt: "например: Melhor feito com ingredientes de alta qualidade",
      hintPlaceholderRu: "например: Лучше всего готовить из качественных ингредиентов",
      proofScreenshot: "Скриншот подтверждения *",
      chooseFile: "Выберите файл...",
      screenshotHelp: "Загрузите скриншот, показывающий рецепт в игре",
      submitterName: "Ваше имя (Опционально)",
      submitterNamePlaceholder: "например: ВашеИмяВИгре",
      submitterNameHelp: "Опционально: Ваше имя в игре для указания авторства",
      processing: "Обработка...",
      submitTitle: "Отправить новый рецепт",
      submitSubtitle: "Поделитесь своим рецептом с сообществом",
      editTitle: "Редактировать рецепт",
      editing: "Редактирование:",
      saveChanges: "Сохранить изменения",
      submitRecipe: "Отправить рецепт",
      successMessage: "Рецепт успешно отправлен! Он будет проверен администраторами."
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
  }
};

export const translateSkill = (skill: string, lang: Language): string => {
  // Try to find the skill in the dictionary, fallback to English/Original
  const dict = TRANSLATIONS[lang].skills;
  return dict[skill] || skill;
};