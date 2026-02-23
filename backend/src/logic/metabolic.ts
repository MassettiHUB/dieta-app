/**
 * Calcola il Basal Metabolic Rate (BMR) usando l'equazione di Mifflin-St. Jeor.
 * 
 * Formula:
 * Uomini: BMR = (10 * peso in kg) + (6.25 * altezza in cm) - (5 * età in anni) + 5
 * Donne: BMR = (10 * peso in kg) + (6.25 * altezza in cm) - (5 * età in anni) - 161
 * 
 * @param weightKg Peso in kg
 * @param heightCm Altezza in cm
 * @param age Età in anni
 * @param gender Genere ("male" o "female")
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  const genderOffset = gender === 'male' ? 5 : -161;
  return 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset;
}

/**
 * Calcola il Total Daily Energy Expenditure (TDEE).
 * 
 * @param bmr Basal Metabolic Rate
 * @param pal Physical Activity Level (scalare)
 * 
 * Livelli PAL comuni:
 * Sedentario: 1.2
 * Leggermente attivo: 1.375
 * Moderatamente attivo: 1.55
 * Molto attivo: 1.725
 * Estremamente attivo: 1.9
 */
export function calculateTDEE(bmr: number, pal: number): number {
  return bmr * pal;
}

/**
 * Calcola l'apporto calorico suggerito per la perdita di peso.
 * 
 * @param tdee Total Daily Energy Expenditure
 * @param targetDeficit Deficit calorico desiderato (es. 500)
 */
export function calculateTargetCalories(tdee: number, targetDeficit: number = 500): number {
  // Evitiamo che l'apporto cali troppo per sicurezza (es. minimo 1200 kcal)
  const minimumCalories = 1200;
  return Math.max(tdee - targetDeficit, minimumCalories);
}
