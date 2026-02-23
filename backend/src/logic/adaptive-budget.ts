/**
 * Interfaccia per i dati giornalieri necessari all'algoritmo adattivo.
 */
interface DailyData {
    weightKg: number;
    caloriesIn: number;
    timestamp: Date;
}

/**
 * Retro-ingegnerizza il TDEE reale basandosi sulle fluttuazioni di peso e l'introito calorico.
 * 
 * Principio:
 * Variazione Energia (kcal) = Introito (kcal) - Consumo (TDEE reale)
 * 1kg di grasso corporeo ~= 7700 kcal (valore standard approssimativo)
 * 
 * @param data Lista di dati su un periodo di 3 settimane (almeno 14-21 giorni consigliati)
 * @returns TDEE stimato
 */
export function retroEngineerTDEE(data: DailyData[]): number {
    if (data.length < 7) {
        // Non abbastanza dati, usa una stima conservativa o il TDEE calcolato inizialmente
        return -1;
    }

    // Ordina per data
    const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Calcola la variazione di peso totale e l'introito totale
    const startWeight = sortedData[0].weightKg;
    const endWeight = sortedData[sortedData.length - 1].weightKg;
    const weightChange = endWeight - startWeight;

    const totalCaloriesIn = sortedData.reduce((acc, curr) => acc + curr.caloriesIn, 0);
    const avgCaloriesIn = totalCaloriesIn / sortedData.length;

    // Bilancio energetico stimato dalla variazione di peso
    // EnergyBalance = weightChange * 7700 / numDays
    const estimatedDailyEnergyBalance = (weightChange * 7700) / sortedData.length;

    // TDEE Reale = Introito Medio - Bilancio Energetico
    const realTdee = avgCaloriesIn - estimatedDailyEnergyBalance;

    return realTdee;
}

/**
 * Logica per programmare Diet Breaks e Refeeds.
 */
export function getMetabolicStrategy(weeksOnDiet: number): 'standard' | 'diet-break' | 'refeed' {
    // Esempio: Diet break ogni 8 settimane di deficit
    if (weeksOnDiet % 9 === 0 && weeksOnDiet !== 0) {
        return 'diet-break';
    }

    // Esempio: Refeed ogni 2 settimane (1-3 giorni, qui semplificato a trigger settimanale)
    if (weeksOnDiet % 2 === 0 && weeksOnDiet !== 0) {
        return 'refeed';
    }

    return 'standard';
}
