import { UpdateTeamDto } from './dto/update.team.dto';
import { TeamDto } from './dto/team.dto';
import { TeamsService } from './teams.service';
import { Body, Controller, Delete, Post, Req, UseGuards, Param, Put } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { MemberRole } from './team.entity';
import { RolesGuard } from './team-role.guard';

@Controller('teams')
export class TeamsController {
    constructor(
        private teamsService: TeamsService
    ) { }

    @Roles(MemberRole.ADMIN, MemberRole.Member)
    @UseGuards(RolesGuard)
    @Post()
    async add(@Req() req: any, @Body() teamDto: TeamDto) {
        return await this.teamsService.addMember(teamDto)
    }

    @Roles(MemberRole.ADMIN)
    @UseGuards(RolesGuard)
    @Put("/:id")
    async update(@Param("id") id: number, @Body() updateTeamDto: UpdateTeamDto) {
        return await this.teamsService.updateMember(id, updateTeamDto)
    }

    @Roles(MemberRole.ADMIN)
    @UseGuards(RolesGuard)
    @Delete("/:id")
    async delete(@Param("id") id: number) {
        await this.teamsService.delete(id)
    }


}
