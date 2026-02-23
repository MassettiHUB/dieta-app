import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { startOfDay, endOfDay, subDays } from 'date-fns';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getSummary(userId: string) {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        // 1. Get User Profile and Metabolic Data
        let user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { healthProfile: true },
        });

        // AUTO-CREATE DEMO USER IF MISSING (per scopi di demo/test)
        if (!user && userId === 'demo-user-id') {
            console.log('Auto-creating missing demo user...');
            user = await this.prisma.user.create({
                data: {
                    id: userId,
                    email: 'demo@example.com',
                    password: 'demo-password',
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
                },
                include: { healthProfile: true },
            });
        }

        if (!user || !user.healthProfile) {
            throw new Error(`Utente ${userId} non trovato nel database.`);
        }

        // 2. Aggregate Today's Nutrition
        const todayLogs = await this.prisma.nutritionLog.findMany({
            where: {
                userId,
                timestamp: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        });

        const nutritionSummary = todayLogs.reduce(
            (acc, log) => {
                acc.calories += log.calories;
                acc.protein += log.protein;
                acc.carbs += log.carbs;
                acc.fats += log.fats;
                return acc;
            },
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        // 3. Get Weight History (last 7 logs)
        const weightHistory = await this.prisma.progressLog.findMany({
            where: { userId },
            orderBy: { timestamp: 'asc' },
            take: 7,
            select: {
                weight: true,
                timestamp: true,
            },
        });

        return {
            tdee: user.healthProfile.adaptiveTdee || user.healthProfile.currentTdee,
            nutrition: nutritionSummary,
            weightHistory: weightHistory.map(h => ({
                weight: h.weight,
                date: h.timestamp.toISOString().split('T')[0],
            })),
        };
    }
}
