import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Recipe } from '../types';

interface UsePaginatedRecipesOptions {
    itemsPerPage?: number;
    searchTerm?: string;
}

interface UsePaginatedRecipesResult {
    recipes: Recipe[];
    loading: boolean;
    error: string | null;
    page: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    refresh: () => void;
}

export function usePaginatedRecipes({
    itemsPerPage = 50,
    searchTerm = '',
}: UsePaginatedRecipesOptions = {}): UsePaginatedRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);

    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const start = page * itemsPerPage;
            const end = start + itemsPerPage - 1;

            let query = supabase
                .from('recipes')
                .select('*', { count: 'exact' })
                .in('status', ['verified', 'legacy_verified'])
                .order('name', { ascending: true });

            // Server-side search if search term exists
            if (searchTerm.trim()) {
                query = query.or(
                    `name.ilike.%${searchTerm}%,mandatory.ilike.%${searchTerm}%`
                );
            }

            const { data, count, error: fetchError } = await query.range(start, end);

            if (fetchError) {
                throw fetchError;
            }

            if (data) {
                const mappedRecipes: Recipe[] = data.map((d) => ({
                    id: d.id,
                    name: d.name,
                    skill: d.skill || '',
                    container: d.container || '',
                    cooker: d.cooker || '',
                    mandatory: d.mandatory || '',
                    difficulty: d.difficulty || undefined,
                    status: d.status || undefined,
                    submitted_by: d.submitted_by || undefined,
                    screenshot_url: d.screenshot_url || undefined,
                    created_at: d.created_at || undefined,
                    legacy_key: d.legacy_key || undefined,
                    source: d.source || undefined,
                    hint_en: d.hint_en || undefined,
                    hint_pt: d.hint_pt || undefined,
                    hint_ru: d.hint_ru || undefined,
                }));

                setRecipes(mappedRecipes);
                setTotalCount(count || 0);
            }
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError(err instanceof Error ? err.message : 'Failed to load recipes');
            setRecipes([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    }, [page, itemsPerPage, searchTerm]);

    useEffect(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    // Reset to page 0 when search term changes
    useEffect(() => {
        if (page !== 0) {
            setPage(0);
        }
    }, [searchTerm]); // Don't include page in deps to avoid infinite loop

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const hasNextPage = page < totalPages - 1;
    const hasPrevPage = page > 0;

    const goToPage = useCallback((newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    }, [totalPages]);

    const nextPage = useCallback(() => {
        if (hasNextPage) {
            setPage((p) => p + 1);
        }
    }, [hasNextPage]);

    const prevPage = useCallback(() => {
        if (hasPrevPage) {
            setPage((p) => p - 1);
        }
    }, [hasPrevPage]);

    const refresh = useCallback(() => {
        fetchRecipes();
    }, [fetchRecipes]);

    return {
        recipes,
        loading,
        error,
        page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        goToPage,
        nextPage,
        prevPage,
        refresh,
    };
}
