import { TasksModule } from './../tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AssignmentsController } from './assignments.controller';
import { AssignmentsService } from './assignments.service';
import { Assignment } from './assignments.entity';
import { UsersModule } from 'src/users/users.module';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment]),
    UsersModule,
    TasksModule,
    TeamsModule
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService]
})
export class AssignmentsModule { }
