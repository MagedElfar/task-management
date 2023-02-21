import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';
import { Body, Controller, Post, Req, Delete, Param, HttpStatus, ParseIntPipe, Put, Get } from '@nestjs/common';

@Controller('projects')
export class ProjectsController {
    constructor(private projectsService: ProjectsService) { }

    @Get()
    async getUserProjects(@Req() req: any) {
        return await this.projectsService.getUserProjects(req.user)
    }

    @Post()
    async create(@Req() req: any, @Body() createProjectDto: CreateProjectDto) {
        return await this.projectsService.create(req.user, createProjectDto)
    }

    @Put("/:id")
    async update(
        @Req() req: any,
        @Body() createProjectDto: CreateProjectDto,
        @Param("id", new ParseIntPipe({
            errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
        })) id: number
    ) {
        return await this.projectsService.update(id, req.user, createProjectDto)
    }

    @Delete(":id")
    async delete(@Req() req: any, @Param("id", new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number) {
        return await this.projectsService.delete(id, req.user)
    }


    @Delete("/leave/:id")
    async leave(@Req() req: any, @Param("id", new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number) {
        await this.projectsService.leave(id, req.user)
    }
}
