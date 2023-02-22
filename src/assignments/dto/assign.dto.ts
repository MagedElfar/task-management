import { IsInt } from "class-validator";

export class AssignDto {
    @IsInt()
    taskId: number

    @IsInt()
    assignmentsToId: number
}