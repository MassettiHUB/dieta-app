import { Controller, Get, Query } from '@nestjs/common';
import { TrainingService } from './training.service';

@Controller('training')
export class TrainingController {
    constructor(private readonly trainingService: TrainingService) { }

    @Get('program')
    getProgram(@Query('level') level: string = 'BEGINNER') {
        return this.trainingService.get12WeekProgram(level);
    }

    @Get('exercises')
    getExercises() {
        // Return all exercises but we could also filter
        return [
            this.trainingService.getExercise('squat'),
            this.trainingService.getExercise('pushup'),
            this.trainingService.getExercise('plank'),
            this.trainingService.getExercise('tricep_dips'),
            this.trainingService.getExercise('lunges'),
            this.trainingService.getExercise('glute_bridge'),
        ];
    }
}
