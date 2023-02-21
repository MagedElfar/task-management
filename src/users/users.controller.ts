import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Get, Put, Request } from '@nestjs/common';
import { UsePipes } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Put()
    async update(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {

        const user = req?.user

        return await this.usersService.update(user, updateUserDto)
    }

    @Get()
    async findUser(@Request() req: any) {
        console.log(req.user)

        const id = req?.user?.id
        return await this.usersService.findOneById(id)
    }
}
