import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTaskDto {
    @IsNotEmpty({
        message: "title is required"
    })
    title: string;

    @IsNotEmpty()
    description: string


    @IsInt()
    projectId: number
}