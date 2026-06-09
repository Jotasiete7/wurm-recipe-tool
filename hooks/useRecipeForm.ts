import { useState, useEffect } from 'react';
import { Recipe } from '../types';

interface RecipeFormData {
    name: string;
    skill: string;
    container: string;
    cooker: string;
    ingredients: Array<{ name: string; qty: string }>;
    screenshot: File | null;
    hintEn: string;
    hintPt: string;
    hintRu: string;
    isUnique: boolean;
    creatorName: string;
    serverName: string;
}

interface RecipeFormErrors {
    name?: string;
    skill?: string;
    container?: string;
    cooker?: string;
    ingredients?: string;
    screenshot?: string;
}

export function useRecipeForm(initialRecipe?: Recipe) {
    // Initialize form data
    const [formData, setFormData] = useState<RecipeFormData>({
        name: initialRecipe?.name || '',
        skill: initialRecipe?.skill || '',
        container: initialRecipe?.container || '',
        cooker: initialRecipe?.cooker || '',
        ingredients: initialRecipe?.mandatory
            ? initialRecipe.mandatory.split(';').map(item => {
                const [name, qty] = item.trim().split(',').map(s => s.trim());
                return { name: name || '', qty: qty || '' };
            })
            : [{ name: '', qty: '' }],
        screenshot: null,
        hintEn: initialRecipe?.hint_en || '',
        hintPt: initialRecipe?.hint_pt || '',
        hintRu: initialRecipe?.hint_ru || '',
        isUnique: initialRecipe?.is_unique || false,
        creatorName: initialRecipe?.creator_name || '',
        serverName: initialRecipe?.server_name || '',
    });

    // Watch for updates of initialRecipe (e.g. after OCR finishes)
    useEffect(() => {
        if (initialRecipe) {
            const name = initialRecipe.name || '';
            const match = name.match(/^([^'\s]+)'s\s+/i);
            const autoIsUnique = initialRecipe.is_unique || !!match;
            let autoCreatorName = initialRecipe.creator_name || '';
            if (!autoCreatorName && match) {
                const rawCreator = match[1];
                autoCreatorName = rawCreator.charAt(0).toUpperCase() + rawCreator.slice(1);
            }
            const autoServerName = initialRecipe.server_name || (match ? 'Harmony' : '');

            setFormData({
                name: name,
                skill: initialRecipe.skill || '',
                container: initialRecipe.container || '',
                cooker: initialRecipe.cooker || '',
                ingredients: initialRecipe.mandatory
                    ? initialRecipe.mandatory.split(';').map(item => {
                        const [name, qty] = item.trim().split(',').map(s => s.trim());
                        return { name: name || '', qty: qty || '' };
                    })
                    : [{ name: '', qty: '' }],
                screenshot: null,
                hintEn: initialRecipe.hint_en || '',
                hintPt: initialRecipe.hint_pt || '',
                hintRu: initialRecipe.hint_ru || '',
                isUnique: autoIsUnique,
                creatorName: autoCreatorName,
                serverName: autoServerName,
            });
            setErrors({});
        }
    }, [initialRecipe]);

    const [errors, setErrors] = useState<RecipeFormErrors>({});

    // Update field
    const updateField = <K extends keyof RecipeFormData>(
        field: K,
        value: RecipeFormData[K]
    ) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            
            // Auto-detect personal/unique recipes (e.g., Calvos's miracle brew)
            if (field === 'name' && typeof value === 'string') {
                const match = value.match(/^([^'\s]+)'s\s+/i);
                if (match) {
                    updated.isUnique = true;
                    const rawCreator = match[1];
                    updated.creatorName = rawCreator.charAt(0).toUpperCase() + rawCreator.slice(1);
                    if (!updated.serverName) {
                        updated.serverName = 'Harmony';
                    }
                }
            }
            
            return updated;
        });

        // Clear error when user starts typing
        if (errors[field as keyof RecipeFormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Update ingredient
    const updateIngredient = (index: number, field: 'name' | 'qty', value: string) => {
        const newIngredients = [...formData.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    };

    // Add ingredient
    const addIngredient = () => {
        setFormData(prev => ({
            ...prev,
            ingredients: [...prev.ingredients, { name: '', qty: '' }],
        }));
    };

    // Remove ingredient
    const removeIngredient = (index: number) => {
        if (formData.ingredients.length > 1) {
            setFormData(prev => ({
                ...prev,
                ingredients: prev.ingredients.filter((_, i) => i !== index),
            }));
        }
    };

    // Validate form
    const validate = (): boolean => {
        const newErrors: RecipeFormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Recipe name is required';
        }

        if (!formData.skill) {
            newErrors.skill = 'Skill is required';
        }

        // Validate ingredients
        const validIngredients = formData.ingredients.filter(
            ing => ing.name.trim()
        );

        if (validIngredients.length === 0) {
            newErrors.ingredients = 'At least one ingredient is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Get mandatory string for database
    const getMandatoryString = (): string => {
        return formData.ingredients
            .filter(ing => ing.name.trim())
            .map(ing => ing.qty.trim() ? `${ing.name.trim()}, ${ing.qty.trim()}` : ing.name.trim())
            .join('; ');
    };

    // Reset form
    const reset = () => {
        setFormData({
            name: initialRecipe?.name || '',
            skill: initialRecipe?.skill || '',
            container: initialRecipe?.container || '',
            cooker: initialRecipe?.cooker || '',
            ingredients: initialRecipe?.mandatory
                ? initialRecipe.mandatory.split(';').map(item => {
                    const [name, qty] = item.trim().split(',').map(s => s.trim());
                    return { name: name || '', qty: qty || '' };
                })
                : [{ name: '', qty: '' }],
            screenshot: null,
            hintEn: initialRecipe?.hint_en || '',
            hintPt: initialRecipe?.hint_pt || '',
            hintRu: initialRecipe?.hint_ru || '',
            isUnique: initialRecipe?.is_unique || false,
            creatorName: initialRecipe?.creator_name || '',
            serverName: initialRecipe?.server_name || '',
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        updateField,
        updateIngredient,
        addIngredient,
        removeIngredient,
        validate,
        getMandatoryString,
        reset,
    };
}
