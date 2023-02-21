import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MemberRole as Role } from "./team.entity";
import { TeamsService } from "./teams.service";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private teamService: TeamsService
    ) { }

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const requireRoles = this.reflector.getAllAndOverride<Role[]>("roles", [
            context.getHandler(),
            context.getClass(),
        ]);

        const req = context.switchToHttp().getRequest();

        let member = null;

        if (req.method === "Post") {
            member = await this.teamService.findOne({
                userId: req.user.id,
                projectId: req.body.project
            });
        } else {
            const currentMember = await this.teamService.findOne({
                id: req.params.id
            });

            member = await this.teamService.findOne({
                userId: req.user.id,
                projectId: currentMember.projectId
            });

            console.log(member)
        }

        if (!requireRoles) {
            return true;
        }

        return requireRoles.some((role) => role === member.role);
    }
}