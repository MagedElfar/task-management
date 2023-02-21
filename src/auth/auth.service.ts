import { SignUpDto } from './dto/signup.dto';
import { UsersService } from './../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as bcrypt from "bcrypt"
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthService {

    private logger = new Logger("AuthService")
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async signUp(signupDto: SignUpDto) {
        const { password, ...user } = await this.usersService.create(signupDto);

        const tokens = this.getTokens(user)

        return {
            user,
            tokens
        }
    }


    login(user: any) {
        const tokens = this.getTokens(user)
        return {
            user,
            ...tokens
        }
    }

    async validateUser(identify: string, pass: string): Promise<any> {

        try {
            const user = await this.usersService.findUserByIdentify(identify);

            if (!user) return null

            const same = await bcrypt.compare(pass, user.password);

            if (user && same) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }
    }

    private jwtPayload(user: Partial<User>) {
        return { id: user.id }
    }

    private getTokens(user: Partial<User>) {

        try {
            const payload = this.jwtPayload(user);

            const secret = this.configService.get('jwt.secret');

            const accessToken = this.jwtService.sign(payload, {
                secret,
                expiresIn: this.configService.get('jwt.accessTokenExpire'),
            });

            const refreshToken = this.jwtService.sign(payload, {
                secret,
                expiresIn: this.configService.get('jwt.refreshTokenExpire'),
            })


            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            this.logger.error(error.stack)
            throw new HttpException(error?.response || error.stack, error?.status || 500)
        }

    }



}
