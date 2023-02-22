import config from './config/index';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ProfileModule } from './profile/profile.module';
import { UsersPhotoModule } from './users-photo/users-photo.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProjectsModule } from './projects/projects.module';
import { TeamsModule } from './teams/teams.module';
import { AssignmentsModule } from './assignments/assignments.module';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRoot(config().typeOrm),
    TasksModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    UsersPhotoModule,
    ProjectsModule,
    TeamsModule,
    AssignmentsModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },]
})
export class AppModule {
  constructor(private dataSource: DataSource) { }
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
