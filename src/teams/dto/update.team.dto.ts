import { Transform } from "class-transformer";
import { IsOptional, IsIn } from "class-validator";
import { MemberRole } from "../team.entity";

export class UpdateTeamDto {
    @Transform(({ value }) => value.toLowerCase())
    @IsIn([MemberRole.ADMIN, MemberRole.Member])
    role?: MemberRole
}