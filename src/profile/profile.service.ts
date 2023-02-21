import { CreateProfileDto } from './dto/create-profile.dto';
import { Injectable, Logger, NotAcceptableException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProfileService {
    private logger = new Logger("ProfileService")

    constructor(@InjectRepository(Profile) private profileRepository: Repository<Profile>) { }

    async findOne(user: User) {
        try {
            const profile = await this.profileRepository.findOneBy({
                userId: user.id
            })

            if (profile) throw new NotAcceptableException("profile for this user exists");

            return null
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async findProfile(user: User) {
        try {
            const profile = await this.profileRepository.findOneBy({
                userId: user.id
            })

            return profile
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }


    async create(user: User, createProfileDto: CreateProfileDto | Partial<CreateProfileDto>): Promise<Profile> {

        try {

            await this.findOne(user);
            const profile = this.profileRepository.create({
                user,
                ...createProfileDto
            })

            return await this.profileRepository.save(profile)
        } catch (error) {
            this.logger.error(error.stack)

            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async update(user: User, createProfileDto: CreateProfileDto | Partial<CreateProfileDto>) {
        try {

            const profile = await this.findProfile(user);

            if (!profile) return await this.create(user, createProfileDto)

            return await this.profileRepository.save({
                ...profile,
                ...createProfileDto
            })



        } catch (error) {

            this.logger.error(error.stack)

            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }
}
