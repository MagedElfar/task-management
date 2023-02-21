import { Profile } from './../profile/profile.entity';
import { ProfileService } from './../profile/profile.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from "bcrypt"
import { HttpException, NotAcceptableException, UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class UsersService {

    private logger = new Logger("UserService")

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private profileService: ProfileService
    ) { }

    async create(createUserDto: CreateUserDto): Promise<User> {

        try {
            const { email, username, password } = createUserDto;

            let user = await this.findOneBy({ email })

            if (user) throw new BadRequestException("user email is already exist");

            user = await this.findOneBy({ username })

            if (user) throw new BadRequestException("username is already exist");

            createUserDto.password = await bcrypt.hash(password, 10)

            return await this.userRepository.save(createUserDto)
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }

    async update(use: User, updateUserDto: UpdateUserDto) {

        try {
            await this.checkUserUpdate(use.id, updateUserDto);

            const { username, email, ...profile } = updateUserDto

            let user = await this.findOneById(use.id);


            if (Object.keys(profile).length > 0) {
                user.profile = await this.profileService.update(use, profile);
            }

            await this.userRepository.save({
                ...user,
                username,
                email
            })


            return await this.findOneById(use.id)

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    private async checkUserUpdate(id: number, updateUserDto: UpdateUserDto) {
        let user = null;

        try {
            if (updateUserDto.username) {
                user = await this.findOneBy({ username: updateUserDto.username });

                if (user?.id !== id && user) throw new NotAcceptableException("username should be uniq");
            }

            if (updateUserDto.email) {
                user = await this.findOneBy({ email: updateUserDto.email });
                if (user?.id !== id && user) throw new NotAcceptableException("user email should be uniq");
            }

            return;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async findOneById(id: number): Promise<Partial<User>> {

        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ["profile", "photo"]
            });

            if (!user) throw new UnauthorizedException();

            const { password, ...result } = user;

            return result;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }

    async findOneBy(data: Partial<CreateUserDto>): Promise<User> {

        try {
            return await this.userRepository.findOneBy(data)

        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    async findOne(data: Partial<User>): Promise<Partial<User>> {
        try {
            const user = await this.userRepository.findOneBy(data);

            if (!user) throw new NotFoundException("user not found");

            const { password, ...result } = user;

            return result;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }


    async findUserByIdentify(identify: string) {

        try {
            const query = this.userRepository
                .createQueryBuilder("user")
                .where("user.username = :identify", { identify })
                .orWhere("user.email = :identify", { identify });


            return await query.getOne()
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }


    }
}
