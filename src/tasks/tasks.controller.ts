import { UpdateStatusDto } from './dto/updated.statua.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { Body, Controller, Put, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { Get, Patch, Post, Query, Req } from '@nestjs/common/decorators';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusPipe } from './pipes/task-status.pipe';

@Controller('tasks')

export class TasksController {
    constructor(private taskService: TasksService) { }

    @Get()
    @UsePipes(TaskStatusPipe, ValidationPipe)
    async findAll(@Query() filterTaskDto: FilterTaskDto) {
        return await this.taskService.findAll(filterTaskDto);
    }

    @Get("/my-tasks")
    @UsePipes(TaskStatusPipe, ValidationPipe)
    async findAllUser(@Req() req: any, @Query() filterTaskDto: FilterTaskDto) {

        console.log(filterTaskDto)

        return await this.taskService.getUserTasks(req.user, filterTaskDto)
    }

    @Get("/:id")
    async findOne(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        return await this.taskService.findOne({ id }, req.user)
    }

    @Post()
    async create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
        if (createTaskDto?.parentId) return await this.taskService.createSubTask(req.user, createTaskDto)
        return await this.taskService.create(req.user, createTaskDto)
    }

    @Put("/:id")
    async update(@Req() req: any, @Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {

        const user = req.user
        return await this.taskService.update(user, id, updateTaskDto)
    }

    @Patch("/:id")
    async updateStatus(@Req() req: any, @Param("id", ParseIntPipe) id: number, @Body() updateStatusDto: UpdateStatusDto) {

        const user = req.user
        return await this.taskService.updateStatues(user, id, updateStatusDto)
    }

    @Delete("/:id")
    async delete(@Req() req: any, @Param("id", new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE
    })) id: number) {

        const user = req.user
        await this.taskService.delete(user, id)

        return
    }

}
