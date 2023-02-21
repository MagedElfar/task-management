import {
    Injectable,
    NestMiddleware,
    BadRequestException,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { validateOrReject } from 'class-validator';
import { UpdateTeamDto } from '../dto/update.team.dto';


@Injectable()
export class UpdateTeamValidationMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const body = req.body;
        const team = new UpdateTeamDto();
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
