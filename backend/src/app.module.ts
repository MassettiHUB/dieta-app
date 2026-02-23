import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { TrainingModule } from './training/training.module';

@Module({
  imports: [UserModule, DashboardModule, AuthModule, TrainingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
