import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Controller, Post, Req } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';

@Controller('profiles')
export class ProfileController {
    constructor(private profileServices: ProfileService) { }

    @Post()
    async create(@Req() req: any, @Body() createProfileDto: CreateProfileDto) {
        return await this.profileServices.create(req.user, createProfileDto)
    }
}
