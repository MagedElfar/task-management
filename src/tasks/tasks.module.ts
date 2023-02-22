import { Task } from './task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    ProjectsModule
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService]
})
export class TasksModule { }
