import { Transform } from "class-transformer"
import { IsIn, IsInt, IsNotEmpty, IsOptional } from "class-validator"
import { MemberRole } from "../team.entity"

export class TeamDto {
    @IsInt()
    project: number

    @IsInt()
    user: number

    @IsOptional()
    @Transform(({ value }) => value.toLowerCase())
    @IsIn([MemberRole.ADMIN, MemberRole.Member])
    role?: MemberRole
}