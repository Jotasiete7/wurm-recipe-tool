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
    pendingRecipesBanner: string;
    topChefsTitle: string;
    topRecipesTitle: string;
    viewFullRanking: string;
    viewPending: string;
    voteSuccess: string;
    alreadyVoted: string;
    cannotConfirmOwnRecipe: string;
    noPendingRecipes: string;
    uniqueRecipe: string;
    uniqueRecipeBy: string;
    back: string;
    statsLinkLabel: string;
    statsLinkSub: string;
    statsExplore: string;
    statsTitle: string;
    statsSubtitle: string;
    statsPeriod7: string;
    statsPeriod30: string;
    statsPeriodAll: string;
    topSearchedTitle: string;
    topVotedTitle: string;
    ingredientDemandTitle: string;
    ingredientDemandSub: string;
    topContributorsTitle: string;
    zeroResultsTitle: string;
    zeroResultsSub: string;
    statsSearchCount: string;
    statsVoteCount: string;
    statsDemandScore: string;
    statsRecipesCount: string;
    statsNoData: string;
    statsBackToDashboard: string;
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
    ocrSubmitCardTitle: string;
    ocrSubmitCardDesc: string;
    ocrSubmitCardSuccess: string;
    ocrHelpLink: string;
    ocrHelpTitle: string;
    ocrHelpDesc: string;
    ocrHelpCorrect: string;
    ocrHelpIncorrect: string;
    ocrHelpClose: string;
    isUniqueLabel: string;
    creatorNameLabel: string;
    serverNameLabel: string;
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
      randomRecipe: "Random Recipe",
      pendingRecipesBanner: "recipes await your verification!",
      topChefsTitle: "Community Contributors",
      topRecipesTitle: "Most Loved of the Month",
      viewFullRanking: "View full ranking",
      viewPending: "View",
      voteSuccess: "Vote recorded! 👍",
      alreadyVoted: "You already voted today for this recipe.",
      cannotConfirmOwnRecipe: "You cannot vote to confirm your own recipe.",
      noPendingRecipes: "No pending recipes at the moment.",
      uniqueRecipe: "⭐ Unique Recipe",
      uniqueRecipeBy: "Recipe created by {creator} on {server}",
      back: "Back",
      statsLinkLabel: "Statistics & Rankings",
      statsLinkSub: "Recipes · Ingredients · Market",
      statsExplore: "Explore",
      statsTitle: "Statistics & Rankings",
      statsSubtitle: "// Community data · Market intelligence for Wurm Online",
      statsPeriod7: "7 Days",
      statsPeriod30: "30 Days",
      statsPeriodAll: "All Time",
      topSearchedTitle: "🔥 Most Searched Recipes",
      topVotedTitle: "❤️ Most Voted Recipes",
      ingredientDemandTitle: "📦 Ingredients in Market Demand",
      ingredientDemandSub: "// Derived from most searched recipes · Useful to decide what to farm and sell",
      topContributorsTitle: "👨‍🍳 Top Contributors",
      zeroResultsTitle: "📉 Searches With No Results",
      zeroResultsSub: "// What players look for but doesn't exist yet — contribute these recipes!",
      statsSearchCount: "searches",
      statsVoteCount: "votes",
      statsDemandScore: "demand pts",
      statsRecipesCount: "recipes",
      statsNoData: "No data yet. Play and search for recipes to generate statistics!",
      statsBackToDashboard: "Back to Dashboard"
    },
    forms: {
      recipeName: "Recipe Name *",
      recipeNamePlaceholder: "e.g., Bread",
      skill: "Skill *",
      selectSkill: "Select skill...",
      container: "Container",
      selectContainer: "Select container...",
      cooker: "Cooker",
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
      proofScreenshot: "Proof Screenshot (Optional)",
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
      successMessage: "Recipe submitted successfully! It will be reviewed by the community.",
      ocrSubmitCardTitle: "Drag & drop your recipe print",
      ocrSubmitCardDesc: "Drag your screenshot or paste (Ctrl+V) to read automatically",
      ocrSubmitCardSuccess: "OCR read successfully! Check the fields below.",
      ocrHelpLink: "How to print?",
      ocrHelpTitle: "Recipe Screenshot Guide",
      ocrHelpDesc: "For the reader to work correctly, take the screenshot in-game with all sub-recipes collapsed (showing the [+] symbol). Sub-recipes expanded with their own cookers and ingredients will confuse the scanner.",
      ocrHelpCorrect: "Correct (Collapsed)",
      ocrHelpIncorrect: "Incorrect (Expanded)",
      ocrHelpClose: "Close Guide",
      isUniqueLabel: "Is this a personal / unique recipe?",
      creatorNameLabel: "Original Creator Name",
      serverNameLabel: "Server Name"
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
      cookerLabel: "Cozinhador",
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
      allCookers: "Todos Cozinhadores",
      dailyChallenge: "Desafio Diário",
      randomRecipe: "Receita Aleatória",
      pendingRecipesBanner: "receitas aguardam sua verificação!",
      topChefsTitle: "Contribuintes da Comunidade",
      topRecipesTitle: "Mais Amadas do Mês",
      viewFullRanking: "Ver ranking completo",
      viewPending: "Ver",
      voteSuccess: "Voto registrado! 👍",
      alreadyVoted: "Você já votou hoje nesta receita.",
      cannotConfirmOwnRecipe: "Você não pode votar para confirmar sua própria receita.",
      noPendingRecipes: "Nenhuma receita pendente no momento.",
      uniqueRecipe: "⭐ Receita Única",
      uniqueRecipeBy: "Receita criada por {creator} em {server}",
      back: "Voltar",
      statsLinkLabel: "Estatísticas & Rankings",
      statsLinkSub: "Receitas · Ingredientes · Mercado",
      statsExplore: "Explorar",
      statsTitle: "Estatísticas & Rankings",
      statsSubtitle: "// Dados da comunidade · Inteligência de mercado para Wurm Online",
      statsPeriod7: "7 Dias",
      statsPeriod30: "30 Dias",
      statsPeriodAll: "Todos os Tempos",
      topSearchedTitle: "🔥 Receitas Mais Buscadas",
      topVotedTitle: "❤️ Receitas Mais Votadas",
      ingredientDemandTitle: "📦 Ingredientes em Alta no Mercado",
      ingredientDemandSub: "// Derivado das receitas mais buscadas · Útil para decidir o que farmar e vender",
      topContributorsTitle: "👨‍🍳 Top Contribuintes",
      zeroResultsTitle: "📉 Buscas Sem Resultado",
      zeroResultsSub: "// O que os jogadores procuram mas ainda não existe · Contribua com essas receitas!",
      statsSearchCount: "buscas",
      statsVoteCount: "votos",
      statsDemandScore: "pts demanda",
      statsRecipesCount: "receitas",
      statsNoData: "Sem dados ainda. Jogue e busque receitas para gerar estatísticas!",
      statsBackToDashboard: "Voltar ao Dashboard"
    },
    forms: {
      recipeName: "Nome da Receita *",
      recipeNamePlaceholder: "ex: Pão",
      skill: "Habilidade *",
      selectSkill: "Selecione a habilidade...",
      container: "Recipiente",
      selectContainer: "Selecione o recipiente...",
      cooker: "Cozinhador",
      selectCooker: "Selecione o cozinhador...",
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
      proofScreenshot: "Screenshot de Prova (Opcional)",
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
      successMessage: "Receita enviada com sucesso! Será revisada pela comunidade.",
      ocrSubmitCardTitle: "Arraste o print da sua receita",
      ocrSubmitCardDesc: "Arraste o print ou cole (Ctrl+V) para ler automaticamente",
      ocrSubmitCardSuccess: "Leitura OCR realizada! Verifique os campos abaixo.",
      ocrHelpLink: "Como printar?",
      ocrHelpTitle: "Guia de Captura de Receita",
      ocrHelpDesc: "Para o leitor funcionar corretamente, tire o print dentro do jogo com todas as sub-receitas fechadas (sinal de [+]). Sub-receitas abertas exibindo seus próprios cozinhadores e ingredientes confundem o scanner.",
      ocrHelpCorrect: "Correto (Colapsado)",
      ocrHelpIncorrect: "Incorreto (Expandido)",
      ocrHelpClose: "Fechar Guia",
      isUniqueLabel: "Esta receita é única / pessoal?",
      creatorNameLabel: "Nome do Criador Original",
      serverNameLabel: "Nome do Servidor"
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
      randomRecipe: "Случайный рецепт",
      pendingRecipesBanner: "рецептов ждут вашей верификации!",
      topChefsTitle: "Участники сообщества",
      topRecipesTitle: "Любимые в этом месяце",
      viewFullRanking: "Посмотреть весь рейтинг",
      viewPending: "Посмотреть",
      voteSuccess: "Голос учтен! 👍",
      alreadyVoted: "Вы уже голосовали за этот рецепт сегодня.",
      cannotConfirmOwnRecipe: "Вы не можете голосовать за подтверждение собственного рецепта.",
      noPendingRecipes: "В данный момент нет рецептов на верификации.",
      uniqueRecipe: "⭐ Уникальный рецепт",
      uniqueRecipeBy: "Рецепт создан {creator} на сервере {server}",
      back: "Назад",
      statsLinkLabel: "Статистика & Рейтинги",
      statsLinkSub: "Рецепты · Ингредиенты · Рынок",
      statsExplore: "Перейти",
      statsTitle: "Статистика & Рейтинги",
      statsSubtitle: "// Данные сообщества · Аналитика рынка Wurm Online",
      statsPeriod7: "7 дней",
      statsPeriod30: "30 дней",
      statsPeriodAll: "За всё время",
      topSearchedTitle: "🔥 Самые искомые рецепты",
      topVotedTitle: "❤️ Самые популярные рецепты",
      ingredientDemandTitle: "📦 Ингредиенты в спросе",
      ingredientDemandSub: "// На основе самых популярных поисков · Полезно для фарма и торговли",
      topContributorsTitle: "👨‍🍳 Топ авторов",
      zeroResultsTitle: "📉 Поиски без результата",
      zeroResultsSub: "// Что ищут игроки, но чего ещё нет · Добавьте эти рецепты!",
      statsSearchCount: "поисков",
      statsVoteCount: "голосов",
      statsDemandScore: "очки спроса",
      statsRecipesCount: "рецептов",
      statsNoData: "Данных пока нет. Играйте и ищите рецепты!",
      statsBackToDashboard: "Вернуться к панели"
    },
    forms: {
      recipeName: "Название рецепта *",
      recipeNamePlaceholder: "например: Хлеб",
      skill: "Навык *",
      selectSkill: "Выберите навык...",
      container: "Контейнер",
      selectContainer: "Выберите контейнер...",
      cooker: "Плита",
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
      proofScreenshot: "Скриншот подтверждения (Опционально)",
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
      successMessage: "Рецепт успешно отправлен! Он будет проверен сообществом.",
      ocrSubmitCardTitle: "Перетащите скриншот рецепта",
      ocrSubmitCardDesc: "Перетащите файл или вставьте (Ctrl+V) для авточтения",
      ocrSubmitCardSuccess: "Текст успешно распознан! Проверьте поля ниже.",
      ocrHelpLink: "Как сделать скриншот?",
      ocrHelpTitle: "Руководство по скриншотам рецептов",
      ocrHelpDesc: "Для корректной работы сканера делайте скриншот в игре со всеми свернутыми подрецептами (показывая символ [+]). Развернутые подрецепты со своими плитами и ингредиентами запутают сканер.",
      ocrHelpCorrect: "Правильно (Свернуто)",
      ocrHelpIncorrect: "Неправильно (Развернуто)",
      ocrHelpClose: "Закрыть руководство",
      isUniqueLabel: "Это личный / уникальный рецепт?",
      creatorNameLabel: "Имя создателя",
      serverNameLabel: "Имя сервера"
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
  if (!skill) return '';
  const dict = TRANSLATIONS[lang].skills;
  const matchKey = Object.keys(dict).find(k => k.toLowerCase() === skill.toLowerCase());
  return matchKey ? dict[matchKey] : skill.charAt(0).toUpperCase() + skill.slice(1);
};