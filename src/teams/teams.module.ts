import { UpdateTeamValidationMiddleware } from './middleware/update-team-validation.middleware';
import { ProjectsModule } from './../projects/projects.module';
import { UsersModule } from './../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { forwardRef, MiddlewareConsumer, Module, RequestMethod, Put } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { Team } from './team.entity';
import { TeamValidationMiddleware } from './middleware/teamValidation.middleware';

@Module({
  imports: [
    forwardRef(() => ProjectsModule),
    TypeOrmModule.forFeature([Team]),
    UsersModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService]
})
export class TeamsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TeamValidationMiddleware)
      .forRoutes({ path: 'teams', method: RequestMethod.POST });

    consumer
      .apply(UpdateTeamValidationMiddleware)
      .forRoutes({ path: 'teams/:id', method: RequestMethod.PUT });

  }

}
