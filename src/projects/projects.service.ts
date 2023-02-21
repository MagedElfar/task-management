import { TeamsService } from './../teams/teams.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, forwardRef, HttpException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { MemberRole } from 'src/teams/team.entity';

@Injectable()
export class ProjectsService {
    private logger = new Logger("ProjectsService")

    constructor(

        @Inject(forwardRef(() => TeamsService))
        private teamsService: TeamsService,

        @InjectRepository(Project) private projectRepository: Repository<Project>
    ) { }

    async getUserProjects(user: User) {
        try {
            const query = this.projectRepository.createQueryBuilder("p")
                .leftJoin("p.teams", "t")
                .where("p.userId = :userId", { userId: user.id })
                .orWhere("t.userId = :userId", { userId: user.id })
                .getMany()
            return await query
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async getSpecificProject(user: User, projectId: number) {
        try {
            const project = await this.projectRepository.createQueryBuilder("p")
                .leftJoin("p.teams", "t")
                .where("p.id = :projectId", { projectId })
                .andWhere("t.userId = :userId", { userId: user.id })
                .andWhere("t.projectId = :projectId", { projectId })
                .getOne()


            if (!project) throw new ForbiddenException();

            return project;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async create(user: User, createProjectDto: CreateProjectDto) {
        try {

            const project = await this.projectRepository.save({
                user,
                ...createProjectDto,
            })

            await this.teamsService.addMember({
                project: project.id,
                user: user.id,
                role: MemberRole.ADMIN
            })

            return project;

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async update(id: number, user: User, createProjectDto: CreateProjectDto) {
        try {

            const project = await this.findOne({
                id,
                userId: user.id
            })

            return await this.projectRepository.save({
                ...project,
                ...createProjectDto
            })

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async delete(id: number, user: User) {
        try {

            const project = await this.findOne({
                id,
                userId: user.id
            })


            await this.projectRepository.delete(id)

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async findOne(data: Partial<Project>) {
        try {

            const project = await this.projectRepository.findOneBy(data);

            if (!project) throw new NotFoundException("project not exists");

            return project;

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async leave(id: number, user: User) {
        try {

            return await this.teamsService.leave(id, user)

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }
}
