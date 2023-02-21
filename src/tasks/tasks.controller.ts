import { CreateTaskDto } from './dto/create-task.dto';
import { Body, Controller, Put, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { Get, Post, Query, Req } from '@nestjs/common/decorators';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatusPipe } from './pipes/task-status.pipe';
import { query } from 'express';

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

        filterTaskDto.user = req.user.id;
        return await this.taskService.findAll(filterTaskDto);
    }

    @Get("/:id")
    async findOne(@Param("id", ParseIntPipe) id: number) {
        return await this.taskService.findOne({ id })
    }

    @Post()
    async create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
        return await this.taskService.create(req.user, createTaskDto)
    }

    @Put("/:id")
    async update(@Req() req: any, @Param("id", ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {

        const user = req.user
        return await this.taskService.update(user, id, updateTaskDto)
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
