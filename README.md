# Wurm Culinária (Wurm Recipes Tool)

Uma ferramenta culinária e livro de receitas interativo para o jogo **Wurm Online**, integrada ao ecossistema A Guilda. Permite buscar receitas, calcular ingredientes, digitalizar receitas via OCR usando capturas de tela e votar/verificar envios da comunidade.

## 🚀 Funcionalidades

1. **Catálogo de Receitas:** Busca rápida e filtragem por habilidade (Cooking, Baking, Hot Food Cooking, etc.).
2. **Reconhecimento OCR (Tesseract.js):** Suporte para carregar, arrastar (drag-and-drop) ou colar (Ctrl+V) capturas de tela das receitas do jogo para digitalização automática.
3. **Níveis de Verificação (`verification_level`):**
   - **Nível 0 (Pendente):** Receita enviada recentemente necessitando de validação.
   - **Nível 1 (Legada):** Migrada do banco original de receitas confiáveis.
   - **Nível 2 (Verificada):** Comprovada por 1 print válido ou confirmação de outro jogador.
   - **Nível 3 (Alta Confiança):** Receita única creditada, receitas com correções comprovadas aplicadas ou receitas curtidas/votadas repetidamente.
4. **Separação de Votos & Curtidas:** Votos dados a receitas pendentes agem como aprovações (`is_like = false`) e não distorcem o ranking de receitas favoritas. Votos em receitas já verificadas agem como curtidas (`is_like = true`) e contam no ranking de mais amadas.
5. **Segurança Antifraude:** Jogadores não podem validar os próprios envios (validação via hash SHA256 do IP do criador contra o do eleitor).
6. **Interface Customizada (Wurm Theme):** Layout responsivo medieval, com cartões de tamanho simétrico e um sistema de notificações personalizado (`useNotification()`) substituindo os `alert()` nativos do navegador.

---

## 🛠️ Tecnologias e Configuração

* **Core:** React 18, TypeScript, Vite.
* **Estilização:** CSS Vanilla, TailwindCSS (Wurm online panel style).
* **Banco de Dados & Autenticação:** Supabase (PostgreSQL).
* **OCR:** Tesseract.js (rodando totalmente no lado do cliente).

### Execução Local

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure as credenciais no arquivo `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://gzhvqprdrtudyokhgxlj.supabase.co
   VITE_SUPABASE_ANON_KEY=seu_anon_key_aqui
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

Toda a lógica está organizada em migrações SQL dentro da pasta `supabase/migrations/`:

1. **`20260608_ocr_voting.sql`**: Criação da tabela de provas (`recipe_proofs`), tabela de votos (`recipe_votes`), funções matemáticas para Jaccard Similarity/normalização de texto e versão inicial do RPC de submissão.
2. **`20260608_verification_levels.sql`**: Adiciona coluna de nível de verificação, povoa banco com criadores históricos e receitas exclusivas, e atualiza o RPC para gerenciar os níveis (1, 2 e 3).
3. **`20260608_separate_votes.sql`**: Separa a lógica de curtidas de receitas amadas versus votos de confirmação, e impede auto-confirmação por IP.
4. **`20260608_fix_shadowing.sql`**: Hotfix para corrigir o erro de compilação/execução do banco `record "r" is not assigned yet` causado pelo sombreamento (shadowing) do alias da tabela `recipes r` com a variável local `r record`.

### Aplicando Atualizações no Supabase

Sempre que houver alteração de banco de dados, execute os scripts correspondentes no **SQL Editor** do Supabase. Em especial, caso ocorra erro no processamento de receitas, certifique-se de reaplicar o script `20260608_fix_shadowing.sql` para sanar o shadowing de variáveis.
