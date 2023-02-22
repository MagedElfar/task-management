import { AssignDto } from './dto/assign.dto';
import { Body, Controller, Post, Req, Delete, UseGuards, HttpStatus, Param, ParseIntPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { Roles } from 'src/teams/roles.decorator';
import { MemberRole } from 'src/teams/team.entity';
import { RolesGuard } from 'src/teams/team-role.guard';

@Controller('assignments')
export class AssignmentsController {

    constructor(private assignmentsService: AssignmentsService) { }

    @Post()
    async assign(@Req() req: any, @Body() assignDto: AssignDto) {
        return this.assignmentsService.assign(req.user, assignDto)
    }


    @Delete("/:id")
    async umAssign(@Req() req: any, @Param("id", new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number) {
        return this.assignmentsService.unAssign(id, req.user)
    }
}
