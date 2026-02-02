import { useState } from 'react';
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
    });

    const [errors, setErrors] = useState<RecipeFormErrors>({});

    // Update field
    const updateField = <K extends keyof RecipeFormData>(
        field: K,
        value: RecipeFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

        if (!formData.container) {
            newErrors.container = 'Container is required';
        }

        if (!formData.cooker) {
            newErrors.cooker = 'Cooker is required';
        }

        // Validate ingredients
        const validIngredients = formData.ingredients.filter(
            ing => ing.name.trim() && ing.qty.trim()
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
            .filter(ing => ing.name.trim() && ing.qty.trim())
            .map(ing => `${ing.name.trim()}, ${ing.qty.trim()}`)
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
