import { LoginUserDto } from './dto/login.dto';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../utils/constants/messages.constants';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserService } from './../user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register.user.dto';
import { enCodePassword } from 'src/utils/helpers/generic.helper';
import { Role } from './enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() body: LoginUserDto, @Req() req: Request) {
    const userToken = await this.authService.login(req.user);
    if (userToken) {
      return {
        data: userToken,
        message: SUCCESS_MESSAGES.USER['001'],
        status: HttpStatus.OK,
      };
    }
  }

  @Post('register/admin')
  async createAdmin(@Body() registerUserDto: RegisterUserDto) {
    const foundUserData = await this.userService.filterUser({
      email: registerUserDto.email,
    });
    if (foundUserData) {
      throw new ConflictException(ERROR_MESSAGES.USER['003']);
    }
    registerUserDto.password = enCodePassword(registerUserDto.password);
    registerUserDto.role = Role.SuperAdmin;
    const registerNewUser = await this.userService.create(registerUserDto);
    if (registerNewUser) {
      return {
        message: SUCCESS_MESSAGES.USER['006'],
        status: HttpStatus.OK,
      };
    }
  }

  @Post('register/client')
  async createClient(@Body() registerUserDto: RegisterUserDto) {
    const foundUserData = await this.userService.filterUser({
      email: registerUserDto.email,
    });
    if (foundUserData) {
      throw new ConflictException(ERROR_MESSAGES.USER['003']);
    }
    registerUserDto.password = enCodePassword(registerUserDto.password);
    registerUserDto.role = Role.Client;
    const registerNewUser = await this.userService.create(registerUserDto);
    if (registerNewUser) {
      return {
        message: SUCCESS_MESSAGES.USER['006'],
        status: HttpStatus.OK,
      };
    }
  }

  @Post('register/service-provider')
  async createSP(@Body() registerUserDto: RegisterUserDto) {
    const foundUserData = await this.userService.filterUser({
      email: registerUserDto.email,
    });
    if (foundUserData) {
      throw new ConflictException(ERROR_MESSAGES.USER['003']);
    }
    registerUserDto.password = enCodePassword(registerUserDto.password);
    registerUserDto.role = Role.ServiceProvider;
    const registerNewUser = await this.userService.create(registerUserDto);
    if (registerNewUser) {
      return {
        message: SUCCESS_MESSAGES.USER['006'],
        status: HttpStatus.OK,
      };
    }
  }
}
