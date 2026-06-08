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
  - **Solução do Bug PL/pgSQL (`record "r" is not assigned yet`):**
    - A função `submit_recipe_proof` declarava uma variável local `r record;` para o loop principal. A query de verificação inicial de confiabilidade usava a tabela alias `recipes r`. Devido às regras de escopo do PL/pgSQL, a consulta tentava ler o registro local `r` em vez do alias da tabela.
    - **Solução:** Renomeado o alias da tabela de `r` para `rec` na consulta de confiabilidade, eliminando o conflito com a variável de loop. Hotfix salvo em `supabase/migrations/20260608_fix_shadowing.sql`.
