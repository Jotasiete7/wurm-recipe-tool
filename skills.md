# Project Skills & Constraints

## Core Architecture
- **Stack:** React, TypeScript, Vite e TailwindCSS.
- **Ícones:** Lucide-react.
- **Módulo Compartilhado:** Há um pacote unificado local chamado `ecossistema-guilda` (frequentemente com aliases `@ecossistema-guilda/*`) que contém a `Header.tsx`, `LanguageSwitch.tsx` e o `EcosystemMenu.tsx`. **Não recrie esses componentes**, importe-os!
- **Hospedagem:** Cloudflare Pages (com deploy automático a cada push no `main`).

## Multi-AI Collaboration Rules
1. **LEIA ESTE ARQUIVO** antes de planejar ou gerar alterações profundas.
2. **Design UI/UX:** A estética é super importante. Mantenha os padrões "vibrantes e premium", tipografia moderna e tema escuro que já existem nos componentes. Não utilize Tailwind puro para resetar botões que já possuem classes padrão no `index.css`.
3. **Menu do Ecossistema:** O menu que interliga os projetos (`EcosystemMenu.tsx`) é unificado. Se precisar adicionar uma ferramenta nova, certifique-se de usar o padrão global.
4. **Multilíngue:** Todos os sites possuem suporte a múltiplos idiomas (`translations.ts`). Qualquer novo texto na interface deve ser adicionado aos objetos de tradução (`en`, `pt`, `es`, `ru`) e nunca "chumbado" direto no HTML.

## Shared Memory / Current Focus
- Arquivo skills.md inicializado.
- **[25 de Maio de 2026]**: Ferramenta "Prospect" adicionada ao `EcosystemMenu` unificado do ecossistema.
- **[08 de Junho de 2026]**: Implementação do fluxo de envio por OCR, níveis de verificação e separação de curtidas.
  - **OCR Recipe Submission**: Upload e digitalização local usando `tesseract.js` (com carregamento tardio/lazy load). Suporta arrastar e soltar (drag-and-drop) e colar imagem do clipboard (Ctrl+V).
  - **Níveis de Verificação (verification_level):**
    - `0` (Aguardando Confirmação / Pending): Receitas submetidas que precisam de prova adicional.
    - `1` (Legada / Legacy Verified): Receitas migradas do banco de dados antigo.
    - `2` (Verificada / Verified): Comprovada por 1 print ou por voto de confirmação de outro jogador.
    - `3` (Alta Confiança / Highly Trusted): Receitas únicas oficiais, receitas com correções aplicadas ou receitas já verificadas que receberam votos/confirmações adicionais.
  - **Separação de Votos & Curtidas (`is_like`):**
    - Votos dados a receitas `pending` servem de confirmação e salvam `is_like = false`, promovendo-as a `verified` (Level 2).
    - Votos dados a receitas `verified` ou `legacy_verified` servem como curtidas e salvam `is_like = true`.
    - A view `top_recipes_monthly` foi atualizada para contar apenas votos onde `is_like = true`, evitando que votos de confirmação alterem a classificação de receitas favoritas.
  - **Segurança (Prevenção de Auto-Verificação):**
    - Um jogador não pode confirmar seu próprio envio. O banco valida se o hash SHA256 do IP do eleitor coincide com o IP do criador do envio original em `recipe_proofs`.
  - **Custom Notification Context (`useNotification`):**
    - Centralizou caixas de diálogo no frontend com `NotificationProvider`, substituindo `alert()` nativos por modais estilizados com efeitos de desfoque (`backdrop-blur`), bordas douradas e ícones Lucide.
    - **Solução:** Renomeado o alias da tabela de `r` para `rec` na consulta de confiabilidade, eliminando o conflito com a variável de loop. Hotfix salvo em `supabase/migrations/20260608_fix_shadowing.sql`.
  - **Melhorias de UX (Envio de Receitas Culinárias e Pessoais):**
    - **Campos Opcionais (Recipiente & Cozinador):** Cooker e Container foram tornados opcionais no formulário (já que no jogo nem toda receita os exige, como em Butchering ou Beverages). Caso sejam omitidos, o site envia-os como strings vazias, as quais o banco de dados já suporta nativamente. Os asteriscos (`*`) correspondentes foram removidos das traduções nos idiomas EN/PT/RU.
    - **Autodetecção de Receitas Únicas:** Criado um padrão de reconhecimento no hook `useRecipeForm`. Quando o nome de uma receita contendo `'s` (ex: `Calvos's miracle brew`) é digitado ou lido pelo OCR, o formulário automaticamente marca o checkbox de "Receita Única", extrai e capitaliza o nome do autor (ex: `Calvos`) e atribui o servidor padrão como `Harmony`.
    - **Correção Ortográfica do OCR & Cadastro de Recipientes/Cozinadores:**
      - **Atualização dos Dicionários:** Adicionados os recipientes do Wurm que estavam faltando na lista de constantes e no parser de OCR (como `Wine barrel`, `Wooden plate`, `Cake tin`, `Pie dish`, `Pottery jar`, `Gut`, `Roasting dish` e `Mushroom`) e o cozinador `Open oven`.
      - **Autocorreção de Typo via OCR:** Como a palavra correspondente agora existe no dicionário oficial (`CONTAINERS_LIST` / `COOKERS_LIST`), erros comuns de digitalização (como o Tesseract ler **"wine barre"** sem a letra "l" no final) são automaticamente corrigidos pelo algoritmo de similaridade textual de forma silenciosa para **"Wine barrel"**.
      - **Solução:** A lógica do buscador `findRecipeMatch` em `dataUtils.ts` foi aprimorada para ignorar correspondências parciais caso o ingrediente contenha modificadores de estado químico/físico do Wurm (`fermenting`, `unfermented`, `undistilled`, `distilled`) que não estejam presentes no nome do alvo correspondente. Isso garante que `"fermenting effervescent beer"` não vire um link clicável para a receita básica de `"beer"`.
    - **Resolução de Conflito de Layout no Gráfico de Habilidades (`Stats.tsx`):**
      - **Problema:** A legenda do gráfico de pizza (donut) exibia categorias duplicadas devido a inconsistências de capitalização no banco de dados (ex: `"Hot food cooking"` vs `"Hot Food Cooking"`). O excesso de linhas na legenda causava um transbordamento que encavalava no contador total de receitas posicionado abaixo.
      - **Solução:**
        1. Tornei o método de tradução `translateSkill` em `translations.ts` insensível a maiúsculas/minúsculas (case-insensitive). Isso agrupa de forma automática e inteligente as habilidades duplicadas, reduzindo o número de elementos exibidos na legenda.
        2. Reposicionei o contador de total de receitas de forma absoluta no **centro vazio do gráfico donut** (estilo card premium), liberando espaço na base do componente e eliminando qualquer possibilidade de colisão visual.
- **[09 de Junho de 2026]**: Histórico de Navegação de Receitas no Modal (`RecipeModal.tsx`):
  - **Histórico de Navegação (Pilha):** Substituição do estado único `selectedRecipe` no `App.tsx` por um array/pilha `recipeHistory`. Isso permite que cliques em sub-receitas empilhem novas receitas, mantendo o histórico de visualização do usuário.
  - **Botão Voltar (Back):** Renderização condicional de um botão "Voltar" (traduzido para EN: `"Back"`, PT: `"Voltar"`, RU: `"Назад"`) no canto superior esquerdo do cabeçalho do modal se houver mais de uma receita na pilha.
  - **Limpeza do Estado:** Fechar o modal por completo limpa todo o histórico de navegação acumulado.

## 🔮 Features Implementadas em Sprint Recente

### [09 de Junho de 2026] — Página de Estatísticas & Rankings + Search Analytics

- **Card de Entrada:** `TopRecipesCard.tsx` substituído por `StatsLinkCard` — botão premium com ícone `BarChart2`, glow animado no hover e seta, que navega para a página `/stats`.
- **Navegação sem Router:** Controle de página via estado `currentPage: 'home' | 'stats'` no `App.tsx`. A página inteira é trocada condicionalmente, sem dependência de React Router.
- **Hook `useSearchLogger` (`hooks/useSearchLogger.ts`):**
  - Captura buscas no campo de pesquisa com **debounce de 800ms** e mínimo de 3 caracteres.
  - Grava na tabela `search_logs` no Supabase de forma **assíncrona e silenciosa** (nunca bloqueia nem quebra o app).
  - Registra tanto buscas **com resultado** (`found=true`, com `recipe_id`) quanto buscas **sem resultado** (`found=false`) — dado valioso de mercado.
- **Tabela `search_logs` (Supabase):** `id`, `term`, `recipe_id` (FK nullable), `recipe_name`, `lang`, `found`, `created_at`. RLS: anon pode inserir, autenticados podem ler.
- **Views de agregação criadas:**
  - `top_searched_recipes` — receitas mais buscadas (sem filtro de período, filtrável via RPC)
  - `top_demanded_ingredients` — cruza buscas → receitas → ingredientes (via `unnest` + `string_to_array` no campo `mandatory`) para gerar score de demanda de mercado
  - `zero_result_searches` — termos buscados sem resultado, agrupados e ordenados
  - `contributor_stats` — top contribuintes por contagem de receitas verificadas
- **`StatsPage.tsx` (`components/StatsPage.tsx`):** Página dedicada com 5 seções:
  1. 🔥 Receitas Mais Buscadas (ranking clicável que abre o modal)
  2. ❤️ Receitas Mais Votadas (ranking clicável)
  3. 📦 Ingredientes em Alta no Mercado (gráfico de barras horizontal `recharts`, barras douradas para top 3)
  4. 👨‍🍳 Top Contribuintes
  5. 📉 Buscas Sem Resultado
- **Seletor de Período:** Botões 7 Dias / 30 Dias / Todos os Tempos. Para períodos filtrados, tenta RPC com `since` e faz fallback para a view geral se o RPC não existir.
- **Arquivo SQL:** `supabase/migrations/20260609_search_analytics.sql` — executar manualmente no painel do Supabase antes do deploy.


- **Conceito Central:** Registrar buscas dos usuários no campo de pesquisa e cruzá-las com os ingredientes das receitas encontradas para gerar um **índice de demanda de mercado** de ingredientes.
- **Fluxo de dados pensado:**
  ```
  Jogador busca "Calvos's miracle brew"
      ↓
  Receita encontrada requer: [Hop, Water, Barley, Sugar]
      ↓
  Esses ingredientes recebem +1 de "demanda" naquele período
      ↓
  Ranking de ingredientes em alta = dado de comércio real
  ```
- **Tabela proposta no Supabase:** `search_logs`
  - `term` — string buscada
  - `recipe_found_id` — UUID da receita encontrada/clicada (nullable se zero results)
  - `lang` — idioma do usuário no momento
  - `created_at` — timestamp
- **Estratégia de captura:** Debounce de ~500ms após o usuário parar de digitar, mínimo 3 caracteres. Capturar só quando houver resultado OU explicitamente registrar como "zero results" (dado valioso: receita que a comunidade quer mas não existe).
- **Visualizações planejadas:**
  - 🔥 **Receitas em Alta** — top buscadas da semana/mês (ranking alternativo ao de curtidas)
  - 📦 **Ingredientes em Demanda** — ranking derivado das receitas mais buscadas
  - 📉 **Zero Results** — buscas sem resultado = lista de receitas que a comunidade quer que existam
- **Por que é diferente dos rankings atuais:**
  - Ranking de curtidas = aprovação pós-visualização (viés para receitas antigas)
  - Ranking de buscas = **intenção e necessidade real** dos jogadores ativos agora
- **Potencial estratégico:** Transforma o site de guia de receitas em uma **ferramenta econômica** — vendedores sabem o que produzir, compradores veem o que está em alta. Diferencial único no ecossistema Wurm Online.
- **Dependências técnicas:** Search atual é client-side (filtra em memória). Precisará de um hook/interceptor para logar buscas no Supabase sem impactar performance.

