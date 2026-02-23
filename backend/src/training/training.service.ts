import { Injectable } from '@nestjs/common';

export interface Exercise {
    id: string;
    name: string;
    description: string;
    muscles: string[];
    equipment: 'NONE' | 'CHAIR' | 'FLOOR';
    imageKey: string;
}

export interface WorkoutDay {
    day: number;
    exercises: {
        exerciseId: string;
        sets: number;
        reps?: number;
        durationSeconds?: number;
        restSeconds: number;
    }[];
}

@Injectable()
export class TrainingService {
    private exercises: Exercise[] = [
        {
            id: 'squat',
            name: 'Squat',
            description: 'Mantenendo la schiena dritta, scendi come se dovessi sederti su una sedia invisibile, poi risali.',
            muscles: ['Quadricipiti', 'Glutei'],
            equipment: 'NONE',
            imageKey: 'squat_exercise_illustration',
        },
        {
            id: 'pushup',
            name: 'Piegamenti (Push-up)',
            description: 'Dalla posizione di plank, scendi con il petto verso terra piegando le braccia e risali.',
            muscles: ['Pettorali', 'Tricipiti'],
            equipment: 'NONE',
            imageKey: 'pushup_exercise_illustration',
        },
        {
            id: 'plank',
            name: 'Plank',
            description: 'In appoggio sugli avambracci e sulle punte dei piedi, mantieni il corpo dritto come una tavola.',
            muscles: ['Core', 'Addominali'],
            equipment: 'FLOOR',
            imageKey: 'plank_exercise_illustration',
        },
        {
            id: 'tricep_dips',
            name: 'Dips per Tricipiti',
            description: 'Appoggia le mani sul bordo di una sedia stabile, scendi con il bacino e risali usando i tricipiti.',
            muscles: ['Tricipiti'],
            equipment: 'CHAIR',
            imageKey: 'tricep_dips_exercise_illustration',
        },
        {
            id: 'lunges',
            name: 'Affondi',
            description: 'Fai un passo avanti e scendi con il ginocchio posteriore verso terra, mantenendo il busto eretto.',
            muscles: ['Gambe', 'Glutei'],
            equipment: 'NONE',
            imageKey: 'lunges_exercise_illustration',
        },
        {
            id: 'glute_bridge',
            name: 'Ponte Glutei',
            description: 'Sdraiato a terra, solleva il bacino verso l\'alto contraendo i glutei e scendi piano.',
            muscles: ['Glutei', 'Bassa schiena'],
            equipment: 'FLOOR',
            imageKey: 'glute_bridge_exercise_illustration',
        },
    ];

    getExercise(id: string) {
        return this.exercises.find((e) => e.id === id);
    }

    get12WeekProgram(level: string) {
        // Generate a 12-week program (3 days per week)
        const program: { week: number; workouts: WorkoutDay[] }[] = [];
        const baseReps = level === 'ADVANCED' ? 15 : level === 'INTERMEDIATE' ? 12 : 8;
        const baseDuration = level === 'ADVANCED' ? 45 : level === 'INTERMEDIATE' ? 30 : 20;

        for (let week = 1; week <= 12; week++) {
            const increment = Math.floor((week - 1) / 2); // Increase intensity every 2 weeks
            const currentReps = baseReps + increment * 2;
            const currentDuration = baseDuration + increment * 5;

            const weeklyWorkouts: WorkoutDay[] = [
                {
                    day: 1,
                    exercises: [
                        { exerciseId: 'squat', sets: 3, reps: currentReps, restSeconds: 60 },
                        { exerciseId: 'pushup', sets: 3, reps: Math.max(5, currentReps - 4), restSeconds: 60 },
                        { exerciseId: 'plank', sets: 3, durationSeconds: currentDuration, restSeconds: 45 },
                    ],
                },
                {
                    day: 3,
                    exercises: [
                        { exerciseId: 'lunges', sets: 3, reps: currentReps, restSeconds: 60 },
                        { exerciseId: 'tricep_dips', sets: 3, reps: Math.max(5, currentReps - 4), restSeconds: 60 },
                        { exerciseId: 'glute_bridge', sets: 3, reps: currentReps + 5, restSeconds: 45 },
                    ],
                },
                {
                    day: 5,
                    exercises: [
                        { exerciseId: 'squat', sets: 2, reps: currentReps + 2, restSeconds: 45 },
                        { exerciseId: 'pushup', sets: 2, reps: Math.max(5, currentReps - 2), restSeconds: 45 },
                        { exerciseId: 'plank', sets: 3, durationSeconds: currentDuration + 10, restSeconds: 30 },
                        { exerciseId: 'glute_bridge', sets: 2, reps: currentReps + 10, restSeconds: 30 },
                    ],
                },
            ];
            program.push({ week, workouts: weeklyWorkouts });
        }

        return program;
    }
}
