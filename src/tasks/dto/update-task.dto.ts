import { TaskPriority, TaskStatus } from './../task.entity';
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

const allowedStatus = Object.values(TaskStatus)

const allowedPriority = Object.values(TaskPriority)

console.log(allowedPriority)

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(allowedStatus)
    status: TaskStatus

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(allowedPriority)
    priority: TaskPriority
}