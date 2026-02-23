import { Module } from '@nestjs/common';
import { TrainingService } from './training.service';
import { TrainingController } from './training.controller';
import { PrismaService } from '../prisma.service';

@Module({
    providers: [TrainingService, PrismaService],
    controllers: [TrainingController],
})
export class TrainingModule { }
