import { MemberRole } from './../teams/team.entity';
import { AssignDto } from './dto/assign.dto';
import { TeamsService } from './../teams/teams.service';
import { UsersService } from './../users/users.service';
import { TasksService } from './../tasks/tasks.service';
import { Assignment } from './assignments.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, HttpException, Injectable, Logger, NotAcceptableException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Team } from 'src/teams/team.entity';

@Injectable()
export class AssignmentsService {

    private logger = new Logger("AssignmentsService")
    constructor(
        @InjectRepository(Assignment)
        private assignmentRepository: Repository<Assignment>,

        private tasksService: TasksService,

        private usersService: UsersService,

        private teamsService: TeamsService

    ) { }

    private async findOne(data: Partial<Assignment>) {
        try {
            const assign = await this.assignmentRepository.findOne({
                relations: ["task", "task.project", "task.project.teams"],
                where: data
            })

            return assign;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async assign(user: User, assignDto: AssignDto) {

        try {
            const { taskId, assignmentsToId } = assignDto
            const task = await this.tasksService.findOne({ id: taskId }, user);

            if (await this.findOne({ taskId, assignmentsToId })) throw new NotAcceptableException("this user is already assigned for this task")

            await this.teamsService.checkIfMembersInSameTeam(task.projectId, [user.id, assignmentsToId])

            const assignmentsTo = await this.usersService.findOneById(assignmentsToId);

            const assignmentsFrom = user;

            return await this.assignmentRepository.save({
                assignmentsFrom,
                assignmentsTo,
                task
            })
        }
        catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async unAssign(id: number, user: User) {

        try {

            const assignment = await this.findOne({ id })


            console.log(assignment)

            if (!assignment) throw new BadRequestException("this user is already unassigned for this task")

            const member = assignment.task.project.teams.find((member: Team) => member.userId === user.id)


            if (member?.role !== MemberRole.ADMIN && assignment.assignmentsFromId !== user.id) throw new ForbiddenException()
            await this.assignmentRepository.delete(id)
        }
        catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }
}
