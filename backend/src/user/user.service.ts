import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { calculateBMR, calculateTDEE } from '../logic/metabolic';
import * as bcrypt from 'bcrypt';

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
    }) {
        const age = this.calculateAge(new Date(data.birthDate));
        const bmr = calculateBMR(data.weight, data.height, age, data.gender);
        const tdee = calculateTDEE(bmr, data.activityLevel);

        const hashedPassword = await bcrypt.hash(data.password || 'DietaApp2026!', 10);

        return this.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                birthDate: new Date(data.birthDate),
                gender: data.gender,
                height: data.height,
                baseWeight: data.weight,
                spiceTolerance: 0, // Default
                healthProfile: {
                    create: {
                        currentBmr: bmr,
                        currentTdee: tdee,
                        adaptiveTdee: tdee,
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
