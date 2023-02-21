import { Transform } from "class-transformer";
import { IsIn, IsOptional } from "class-validator";
import { Gender } from "../profile.entity";

export class CreateProfileDto {
    @IsOptional()
    firstName: string

    @IsOptional()
    lastName: string

    @IsOptional()
    phone: string

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn([Gender.FEMALE, Gender.MALE])
    gender: Gender;
}