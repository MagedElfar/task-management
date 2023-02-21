import { ProfileModule } from './../profile/profile.module';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm'


@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfileModule],
  providers: [
    UsersService,

  ],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule { }
