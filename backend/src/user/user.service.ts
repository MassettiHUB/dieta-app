import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { calculateBMR, calculateTDEE, calculateBodyFat } from '../logic/metabolic';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async createProfile(data: {
        name: string;
        birthDate: string;
        gender: 'male' | 'female';
        height: number;
        weight: number;
        activityLevel: number;
        email: string;
        password?: string;
        fitnessGoal?: string;
        trainingLevel?: string;
        availableEquipment?: string[];
        neck?: number;
        waist?: number;
        hip?: number;
        chest?: number;
    }) {
        const age = this.calculateAge(new Date(data.birthDate));
        const bmr = calculateBMR(data.weight, data.height, age, data.gender);
        const tdee = calculateTDEE(bmr, data.activityLevel);
        const bodyFat = calculateBodyFat(data.gender, data.height, data.neck || 0, data.waist || 0, data.hip);

        const hashedPassword = await bcrypt.hash(data.password || 'DietaApp2026!', 10);

        return this.prisma.user.upsert({
            where: { email: data.email },
            update: {
                name: data.name,
                birthDate: new Date(data.birthDate),
                gender: data.gender,
                height: data.height,
                baseWeight: data.weight,
                activityLevel: data.activityLevel,
                fitnessGoal: data.fitnessGoal || 'MAINTAIN',
                trainingLevel: data.trainingLevel || 'BEGINNER',
                availableEquipment: data.availableEquipment || [],
                healthProfile: {
                    update: {
                        currentBmr: bmr,
                        currentTdee: tdee,
                        adaptiveTdee: tdee,
                        bodyFatPercentage: bodyFat,
                        neckCircumference: data.neck,
                        waistCircumference: data.waist,
                        hipCircumference: data.hip,
                        chestCircumference: data.chest,
                    },
                },
            },
            create: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                birthDate: new Date(data.birthDate),
                gender: data.gender,
                height: data.height,
                baseWeight: data.weight,
                activityLevel: data.activityLevel,
                fitnessGoal: data.fitnessGoal || 'MAINTAIN',
                trainingLevel: data.trainingLevel || 'BEGINNER',
                availableEquipment: data.availableEquipment || [],
                spiceTolerance: 0,
                healthProfile: {
                    create: {
                        currentBmr: bmr,
                        currentTdee: tdee,
                        adaptiveTdee: tdee,
                        bodyFatPercentage: bodyFat,
                        neckCircumference: data.neck,
                        waistCircumference: data.waist,
                        hipCircumference: data.hip,
                        chestCircumference: data.chest,
                    },
                },
            },
            include: {
                healthProfile: true,
            },
        });
    }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
