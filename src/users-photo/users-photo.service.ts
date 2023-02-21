import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersPhotos } from './users-photo.entity';
import Media from 'src/utilities/media';
import * as path from "path";

@Injectable()
export class UsersPhotoService {
    private logger = new Logger("UsersPhotoService")
    constructor(
        @InjectRepository(UsersPhotos) private userPhotoRepository: Repository<UsersPhotos>
    ) { }

    async findOne(user: User) {
        try {
            const photo = await this.userPhotoRepository.findOneBy({
                userId: user.id
            })

            return photo;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async store(user: User, file: Express.Multer.File) {
        try {

            const photo = await this.findOne(user);

            let userPhoto: any = {};

            if (!photo) {
                userPhoto.user = user;
            } else {
                await Media.deleteSingleMedia(path.join(path.dirname(__dirname), "..", "uploads", "avatar", photo.url));

                userPhoto = {
                    ...photo
                }
            }

            userPhoto.url = file.filename


            return await this.userPhotoRepository.save(userPhoto)


        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async delete(user: User) {
        try {

            const photo = await this.findOne(user);


            if (!photo) throw new NotFoundException("no image found")

            await Media.deleteSingleMedia(path.join(path.dirname(__dirname), "..", "uploads", "avatar", photo.url));

            return await this.userPhotoRepository.delete(photo.id)


        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

}
