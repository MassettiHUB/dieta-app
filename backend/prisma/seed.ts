import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const datasetPath = path.join(__dirname, 'recipes_dataset.json');
    const recipesData = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

    console.log(`Found ${recipesData.length} recipes in dataset.`);

    for (const r of recipesData) {
        // Check if recipe already exists to avoid duplicates
        const existingRecipe = await prisma.recipe.findFirst({
            where: { name: r.name },
        });

        if (existingRecipe) {
            console.log(`Recipe "${r.name}" already exists. Skipping.`);
            continue;
        }

        const { ingredients, ...recipeDetails } = r;

        const recipe = await prisma.recipe.create({
            data: {
                ...recipeDetails,
                ingredients: {
                    create: ingredients,
                },
            },
        });
        console.log(`Created recipe: ${recipe.name} (ID: ${recipe.id})`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
