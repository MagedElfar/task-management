import { Transform } from "class-transformer";
import { IsDate, IsDefined, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, MinDate, Validate, ValidateIf, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TaskPriority } from "../task.entity";


@ValidatorConstraint({ name: 'null-or-number', async: false })
export class IsNumberOrNull implements ValidatorConstraintInterface {
    validate(text: any, args: ValidationArguments) {
        return typeof text === 'number' || text === "null";
    }

    defaultMessage(args: ValidationArguments) {
        return '($value) must be number or null';
    }
}

const allowedPriority = Object.values(TaskPriority)

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
    @Transform(({ value }) => {
        if (value === "null") {
            return null
        }

        return value
    })
    @IsDefined()
    @Validate(IsNumberOrNull)
    parentId: number | null

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    duo_date: Date

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn(allowedPriority)
    priority: TaskPriority
}