import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: "identify"
        });
    }

    async validate(identify: string, password: string): Promise<any> {

        const user = await this.authService.validateUser(identify, password);
        if (!user) {
            throw new UnauthorizedException("Invalid Email or Password")
        }
        return user;
    }
}
