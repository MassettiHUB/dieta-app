/**
 * Calcola le calorie bruciate durante un'attività usando i valori MET.
 * 
 * Formula: Calorie = MET * pesoKg * (durataMinuti / 60)
 * 
 * @param met Valore Metabolic Equivalent of Task
 * @param weightKg Peso del soggetto in kg
 * @param durationMinutes Durata dell'attività in minuti
 */
export function calculateCaloriesBurned(
    met: number,
    weightKg: number,
    durationMinutes: number
): number {
    return met * weightKg * (durationMinutes / 60);
}

/**
 * Valori MET comuni per mHealth app.
 */
export const MET_VALUES = {
    walking_brisk: 3.5,
    bodyweight_exercise_light: 4.0,
    bodyweight_exercise_moderate: 6.0,
    bodyweight_exercise_vigorous: 8.0,
};

/**
 * Calcola la densità corporea usando l'equazione di Jackson-Pollock a 7 siti per UOMINI.
 * Siti: Petto, Ascella media, Tricipite, Sottoscapolare, Addominale, Soprailiaco, Coscia.
 * 
 * @param sum7 Somma dei 7 siti skinfold (in mm)
 * @param age Età in anni
 */
export function calculateBodyDensityMale7(sum7: number, age: number): number {
    return 1.112 - (0.00043499 * sum7) + (0.00000055 * Math.pow(sum7, 2)) - (0.00028826 * age);
}

/**
 * Calcola la densità corporea usando l'equazione di Jackson-Pollock a 7 siti per DONNE.
 * 
 * @param sum7 Somma dei 7 siti skinfold (in mm)
 * @param age Età in anni
 */
export function calculateBodyDensityFemale7(sum7: number, age: number): number {
    return 1.097 - (0.00046971 * sum7) + (0.00000056 * Math.pow(sum7, 2)) - (0.00012828 * age);
}

/**
 * Converte la densità corporea in % Grasso Corporeo usando l'equazione di Siri.
 * Formula: Body Fat % = (495 / Density) - 450
 * 
 * @param density Densità corporea
 */
export function calculateBodyFatPercentage(density: number): number {
    return (495 / density) - 450;
}
