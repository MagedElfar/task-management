import { CreateUserDto } from './../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { LoginDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/decorators';
import { SignUpDto } from './dto/signup.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UsePipes(new ValidationPipe({
        whitelist: true
    }))
    @Post("signup")
    async signup(@Body() SignUpDto: SignUpDto) {
        return this.authService.signUp(SignUpDto)
    }

    @Public()
    @UseGuards(AuthGuard('local'))
    @Post("login")
    @HttpCode(200)
    login(@Request() req: Req) {
        return this.authService.login(req.user);
    }

}
