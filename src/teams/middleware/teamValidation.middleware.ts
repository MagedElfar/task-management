import {
    Injectable,
    NestMiddleware,
    BadRequestException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { TeamDto } from '../dto/team.dto';

@Injectable()
export class TeamValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;
        const team = new TeamDto();
        const errors = [];

        Object.keys(body).forEach((key) => {
            team[key] = body[key];
        });

        try {
            await validateOrReject(team);
        } catch (errs) {
            errs.forEach((err: any) => {
                Object.values(err.constraints).forEach((constraint) =>
                    errors.push(constraint),
                );
            });
        }

        if (errors.length) {
            throw new BadRequestException(errors);
        }

        next();
    }
}
