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
    // --- Create Demo User ---
    const demoUserId = 'demo-user-id';
    const existingUser = await prisma.user.findUnique({ where: { id: demoUserId } });

    if (!existingUser) {
        console.log('Creating demo user...');
        await prisma.user.create({
            data: {
                id: demoUserId,
                email: 'demo@example.com',
                password: 'hashed-password-here', // In produzione usare bcrypt
                name: 'Mauro Demo',
                birthDate: new Date('1990-01-01'),
                gender: 'MALE',
                height: 180,
                baseWeight: 80,
                spiceTolerance: 5,
                healthProfile: {
                    create: {
                        currentBmr: 1800,
                        currentTdee: 2500,
                        adaptiveTdee: 2500,
                    }
                }
            }
        });
        console.log('Demo user created.');
    } else {
        console.log('Demo user already exists.');
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
