export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
    category: 'Produce' | 'Meat' | 'Dairy' | 'Pantry' | 'Frozen' | 'Other';
}

export interface Recipe {
    id: string;
    name: string;
    ingredients: Ingredient[];
}

/**
 * Applica un buffer del +20% alle calorie stimate per i pasti fuori casa.
 * 
 * @param estimatedCalories Calorie stimate dall'utente o dal sistema
 */
export function applyRestaurantBuffer(estimatedCalories: number): number {
    return estimatedCalories * 1.2;
}

/**
 * Aggrega gli ingredienti di più ricette e consolida le quantità.
 * 
 * @param recipes Lista di ricette selezionate per la settimana
 */
export function aggregateIngredients(recipes: Recipe[]): Map<string, Ingredient> {
    const aggregatedIngredients = new Map<string, Ingredient>();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            const key = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`;
            if (aggregatedIngredients.has(key)) {
                const existing = aggregatedIngredients.get(key)!;
                existing.quantity += ing.quantity;
            } else {
                aggregatedIngredients.set(key, { ...ing });
            }
        });
    });

    return aggregatedIngredients;
}

/**
 * Sottrae gli ingredienti già presenti nella dispensa virtuale.
 * 
 * @param shoppingList Lista della spesa aggregata
 * @param pantry Dispensa virtuale dell'utente
 */
export function filterWithPantry(
    shoppingList: Map<string, Ingredient>,
    pantry: Map<string, Ingredient>
): Ingredient[] {
    const finalItems: Ingredient[] = [];

    shoppingList.forEach((ing, key) => {
        const pantryItem = pantry.get(key);
        if (pantryItem) {
            const remainingQuantity = ing.quantity - pantryItem.quantity;
            if (remainingQuantity > 0) {
                finalItems.push({ ...ing, quantity: remainingQuantity });
            }
        } else {
            finalItems.push(ing);
        }
    });

    return finalItems;
}

/**
 * Organizza la lista della spesa per corsie del supermercato.
 * 
 * @param items Lista di ingredienti da acquistare
 */
export function categorizeByAisle(items: Ingredient[]): Record<string, Ingredient[]> {
    return items.reduce((acc, item) => {
        const cat = item.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Ingredient[]>);
}
