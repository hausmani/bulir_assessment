import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { Role } from '../enums/role.enum';

export class RegisterUserDto {
  @ApiProperty({ required: true })
  @Transform((value) => value.value.trim())
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: true })
  @Transform((value) => value.value.trim())
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ required: true })
  @Transform((value) => value.value.trim())
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ required: true, example: 'SuperAdmin/Client/ServiceProvider', })
  @IsString()
  @IsNotEmpty()
  role: Role;
}
