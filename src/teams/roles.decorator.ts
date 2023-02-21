import { SetMetadata } from "@nestjs/common";
import { MemberRole as Role } from "./team.entity";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);