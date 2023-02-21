import { ProjectsService } from './../projects/projects.service';
import { Task } from './task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {

    private logger = new Logger("TasksService")

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,

        private projectsService: ProjectsService
    ) { }


    async findAll(filterTaskDto: FilterTaskDto): Promise<{
        tasks: Task[],
        count: number
    }> {

        try {
            const { page = 1, limit = 10, search, status, user } = filterTaskDto;

            const offset = (+page - 1) * +limit;

            const query = this.taskRepository.createQueryBuilder("task");

            if (status) {
                query.orWhere("task.status = :status", { status })
            }

            if (search) {
                query.orWhere("task.title like :search or task.description like :search", { search: `%${search}%` })

            }

            if (user) {
                query.orWhere("task.userId = :user", { user })
            }

            const tasksAndCount = await query
                .select(["task", "user.id", "user.username", "user.email"])
                .leftJoin("task.user", "user")
                .limit(+limit)
                .offset(offset)
                .getManyAndCount();

            return {
                tasks: tasksAndCount[0],
                count: tasksAndCount[1]
            }
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }


    async findOne(data: Partial<Task>): Promise<Task> {

        try {
            const query = this.taskRepository.createQueryBuilder("task")


            Object.keys(data).forEach((key: string, index: number) => {
                query.andWhere(`task.${key} = :${key}`, { [key]: data[key] })
            })

            const task = await query
                .leftJoin("task.user", "user")
                .select(["task", "user.id", "user.username", "user.email"])
                .getOne();

            if (!task) {
                throw new ForbiddenException()
            }

            return task
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }


    async create(user: User, createTaskDto: CreateTaskDto): Promise<Task> {

        try {

            const { projectId, ...others } = createTaskDto;

            const project = await this.projectsService.getSpecificProject(user, projectId);


            console.log(project);

            const task = this.taskRepository.create({
                project,
                user,
                ...others
            })

            return await this.taskRepository.save(task)
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }



    async update(user: User, id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        try {
            let task = await this.findOne({
                id,
                userId: user.id
            })

            return await this.taskRepository.save({
                ...task,
                ...updateTaskDto
            })
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async delete(user: User, id: number): Promise<void> {

        try {
            await this.findOne({
                id,
                userId: user.id
            })

            const result = await this.taskRepository.delete(id);

            if (!result.affected) {
                throw new NotFoundException("task not found")
            };

            return;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async assign(userId: number, taskId: number, user: User) {
        try {

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }
}
