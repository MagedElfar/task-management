import { UsersPhotoService } from './users-photo.service';
import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from "uuid";
import * as path from 'path';

@Controller('users')
export class UsersPhotoController {
    constructor(
        private photoServices: UsersPhotoService
    ) { }


    @Post("photo")
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: "./uploads/avatar",
            filename: (req, file, cb) => {
                cb(null, `${uuidv4()}-${file.originalname}`)
            }
        }),


    }))
    async upload(@Req() req: any, @UploadedFile() file: Express.Multer.File) {

        return await this.photoServices.store(req.user, file)
    }

    @Delete("photo")
    async delete(@Req() req: any) {

        await this.photoServices.delete(req.user)

        return
    }
}
