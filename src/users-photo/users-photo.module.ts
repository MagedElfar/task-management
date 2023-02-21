import { ConfigModule } from '@nestjs/config';
import { UsersPhotos } from './users-photo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersPhotoController } from './users-photo.controller';
import { UsersPhotoService } from './users-photo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersPhotos]),
    ConfigModule
  ],
  controllers: [UsersPhotoController],
  providers: [UsersPhotoService]
})
export class UsersPhotoModule { }
