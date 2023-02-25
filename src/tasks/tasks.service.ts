import { join } from 'path';
import { UpdateStatusDto } from './dto/updated.statua.dto';
import { ProjectsService } from './../projects/projects.service';
import { Task } from './task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';

@Injectable()
export class TasksService {

    private logger = new Logger("TasksService")

    constructor(
        @InjectRepository(Task)
        private taskRepository: Repository<Task>,

        private projectsService: ProjectsService
    ) { }


    private queryFilter(query: SelectQueryBuilder<Task>, filterTaskDto: FilterTaskDto): SelectQueryBuilder<Task> {
        const { page = 1, limit = 10, search, status } = filterTaskDto;

        const offset = (+page - 1) * +limit;

        if (status) {
            query.andWhere("task.status = :status", { status })
        }

        if (search) {
            query.andWhere("task.title  like :search", { search: `%${search}%` })
        }

        query.limit(+limit)
            .offset(offset)


        return query
    }

    async getUserTasks(user: User, filterTaskDto: FilterTaskDto) {
        let query = this.taskRepository.createQueryBuilder("task")
            .leftJoin("task.assignments", "ta")
            .where(qp => {
                qp.where("ta.assignmentsTo = :user", { user: user.id })
                if (Object.keys(filterTaskDto).length > 0) {
                    this.queryFilter(qp, filterTaskDto)
                }
            })
            .orWhere("task.userId = :user", { user: user.id })
        if (Object.keys(filterTaskDto).length > 0) {
            this.queryFilter(query, filterTaskDto)
        }

        const tasks = await query.getManyAndCount()

        return {
            tasks: tasks[0],
            count: tasks[1]
        }
    }


    async findAll(filterTaskDto: FilterTaskDto): Promise<{
        tasks: Task[],
        count: number
    }> {

        try {
            const query = this.taskRepository.createQueryBuilder("task");


            const tasksAndCount = await query
                .select(["task", "user.id", "user.username", "user.email"])
                .leftJoin("task.user", "user")
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


    async findOne(data: Partial<Task>, user: User): Promise<Task> {

        try {
            const query = this.taskRepository.createQueryBuilder("task")


            Object.keys(data).forEach((key: string, index: number) => {
                query.andWhere(`task.${key} = :${key}`, { [key]: data[key] })
            })

            const task = await query
                .leftJoinAndSelect("task.user", "user")
                .leftJoinAndSelect("user.photo", "photo")
                .leftJoinAndSelect("task.subTasks", "subTasks")
                .leftJoinAndSelect("task.project", "project")
                .leftJoinAndSelect("project.teams", "teams")
                .leftJoinAndSelect("task.assignments", "assignments")
                .leftJoinAndSelect("assignments.assignmentsTo", "assignTo")
                .leftJoinAndSelect("assignTo.photo", "assignToPhoto")
                .getOne();

            console.log("task = ", data)

            if (!task) {
                throw new NotFoundException()
            }


            delete task.user.password

            if (
                task.userId !== user.id &&
                !task.project?.teams.some((member: Team) => member.userId === user.id)

            ) {
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

    async createSubTask(user: User, createTaskDto: CreateTaskDto) {
        try {
            const { projectId, ...others } = createTaskDto;

            const parent = await this.findOne({ id: createTaskDto.parentId }, user)

            const project = await this.projectsService.getSpecificProject(user, projectId);


            console.log(project);

            const task = this.taskRepository.create({
                parent,
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
            }, user)

            return await this.taskRepository.save({
                ...task,
                ...updateTaskDto
            })
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async updateStatues(user: User, id: number, updateStatusDto: UpdateStatusDto): Promise<Task> {
        try {
            let task = await this.findOne({
                id,
            }, user)

            return await this.taskRepository.save({
                ...task,
                ...updateStatusDto
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
            }, user)

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
