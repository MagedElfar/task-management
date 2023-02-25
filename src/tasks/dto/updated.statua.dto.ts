import { Transform } from "class-transformer";
import { IsOptional, IsIn } from "class-validator";
import { TaskStatus } from "../task.entity";
const allowedStatus = Object.values(TaskStatus)


export class UpdateStatusDto {
    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(allowedStatus)
    status: TaskStatus
} 