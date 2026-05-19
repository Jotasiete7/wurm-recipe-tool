-- 1. CRIAR O BUCKET DE ARMAZENAMENTO 'images' (SE NÃO EXISTIR)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'images', 
    'images', 
    true,                      -- Permite acesso público para leitura das imagens
    5242880,                   -- Limite de 5MB por arquivo
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;


-- 3. POLÍTICA DE LEITURA PÚBLICA
DROP POLICY IF EXISTS "Public access to images bucket" ON storage.objects;
CREATE POLICY "Public access to images bucket" ON storage.objects
    FOR SELECT TO public 
    USING (bucket_id = 'images');

-- 4. POLÍTICA DE ENVIO APENAS PARA USUÁRIOS AUTENTICADOS
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images" ON storage.objects
    FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'images');

-- 5. POLÍTICA DE EXCLUSÃO (OPCIONAL - APENAS PARA O DONO OU ADMIN)
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;
CREATE POLICY "Authenticated users can delete images" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'images');
