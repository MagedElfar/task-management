import { User } from 'src/users/user.entity';
import { ProjectsService } from './../projects/projects.service';
import { UsersService } from './../users/users.service';
import { TeamDto } from './dto/team.dto';
import { ForbiddenException, forwardRef, HttpException, Inject, Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './team.entity';
import { UpdateTeamDto } from './dto/update.team.dto';

@Injectable()
export class TeamsService {

    private logger = new Logger("TeamsService")
    constructor(
        @Inject(forwardRef(() => ProjectsService))
        private projectsService: ProjectsService,

        @InjectRepository(Team)
        private teamRepository: Repository<Team>,

        private usersService: UsersService,
    ) { }


    async getMemberProjects(user: User) {
        try {
            const query = this.teamRepository.createQueryBuilder("team")
                .where("team.userId = :userId", { userId: user.id })
                .getMany();

            return await query
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }



    async addMember(teamDto: TeamDto) {

        try {
            const { user: userId, project: projectId } = teamDto;

            await this.addMemberPosability(userId, projectId);

            const project = await this.projectsService.findOne({ id: projectId })
            const user = await this.usersService.findOne({ id: userId })

            return await this.teamRepository.save({
                ...teamDto,
                project,
                user,
            })
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async updateMember(id: number, updateTeamDto: UpdateTeamDto) {

        try {
            const member = await this.findOne({ id })

            console.log(updateTeamDto)

            return await this.teamRepository.save({
                ...member,
                ...updateTeamDto
            })
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async leave(projectId: number, user: User) {
        try {

            const member = await this.findOne({
                userId: user.id,
                projectId
            });

            return await this.delete(member.id)


        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }


    async delete(id: number) {
        try {

            return await this.teamRepository.delete(id)


        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async findOne(data: Team | Partial<Team>) {
        try {
            const member = await this.teamRepository.findOneBy(data)

            if (!member) throw new ForbiddenException("Forbidden resource");

            return member;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async checkIfMembersInSameTeam(projectId: number, users: number[]) {
        try {
            const members = await this.teamRepository.createQueryBuilder("t")
                .where("t.projectId = :projectId", { projectId })
                .andWhere({ userId: In(users) })
                .getMany()

            const newArr = [...new Set(users)];

            console.log(members.length, newArr.length)

            if (members.length !== newArr.length) throw new NotAcceptableException("users not in same team");

            return members;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    private async addMemberPosability(userId: number, projectId: number) {
        try {
            const member = await this.teamRepository.findOneBy({
                userId,
                projectId
            })

            if (member) throw new NotAcceptableException("this user is already member in this team")
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

}
