import { Transform } from "class-transformer";
import { IsIn, IsNumberString, IsOptional } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class FilterTaskDto {
    @IsOptional()
    @Transform(({ value }) => value.toUpperCase())

    @IsIn([TaskStatus.DONE, TaskStatus.OPEN, TaskStatus.IN_PROGRESS])
    status: TaskStatus;


    search: string;

    @IsOptional()
    @IsNumberString()
    limit: string;

    @IsOptional()
    @IsNumberString()
    page: string

    @IsOptional()
    user: number
} 