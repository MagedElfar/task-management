import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";
import { TaskStatus } from "../tasks.model";
import { CreateTaskDto } from "./create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    readonly allowedStatus = [
        TaskStatus.OPEN,
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS
    ];

    @IsOptional()
    @Transform(({ value }) => value.toUpperCase())
    @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
    status: TaskStatus
}