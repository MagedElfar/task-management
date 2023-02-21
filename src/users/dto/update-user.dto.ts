import { CreateProfileDto } from './../../profile/dto/create-profile.dto';
import { CreateUserDto } from './create-user.dto';
import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends IntersectionType(
    OmitType(CreateUserDto, ['password'] as const),
    PartialType(CreateProfileDto)
) { }
