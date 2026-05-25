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
