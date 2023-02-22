import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsNotEmpty, IsOptional, MinDate } from "class-validator";


export class CreateTaskDto {
    @IsNotEmpty({
        message: "title is required"
    })
    title: string;

    @IsNotEmpty()
    description: string


    @IsInt()
    projectId: number

    @IsOptional()
    @IsInt()
    parentId: number

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    duo_date: Date

}