import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  ConflictException,
  Get,
  Query,
  Req, NotFoundException, ForbiddenException, Param
} from '@nestjs/common';
import {
  enCodePassword,
} from '../utils/helpers/generic.helper';
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from 'src/utils/constants/messages.constants';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/utils/decorators/role.decorator';
import { PaginationParams } from 'src/utils/dtos/pagination.dto';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/role.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth('access_token')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const foundUser = await this.userService.filterUser({
      email: createUserDto.email,
      isDeleted: false,
    });
    if (foundUser) {
      throw new ConflictException(ERROR_MESSAGES.USER['003']);
    }
    createUserDto.password = enCodePassword(createUserDto.password);
    const createNewUser = await this.userService.create(createUserDto);
    if (createNewUser) {
      return {
        message: SUCCESS_MESSAGES.USER['006'],
        status: HttpStatus.CREATED,
      };
    }
  }


//Task #1
//Returns tasks data of given task id only if that task belongs to the user logged in. OR to super admin
  @UseGuards(RolesGuard)
  @Roles(Role.SuperAdmin, Role.Client)
  @Get('tasks/:id')
  async findOneTask(@Param('id') id: string, @Req() req) {

    return await this.userService.getTaskById(
      id,
      req,
    );

  }


//Task #2
//the logic is just that it returns users data to all authenticated users. 
  @Get('service-providers')
  async findMe(@Req() req) {
    const userData = await this.userService.filterUser(req.user.id);
    if (userData) {
      return {
        data: userData,
        status: HttpStatus.OK,
      };
    }
  }




//Task #3
//This returns data of current service provider logged in, and solely for service providers' role as per understading.
  @Get('service-providers/bookings')
  @Roles(Role.ServiceProvider)
  async findUserBookings(@Req() req) {

    return await this.userService.getBookingdataByUser(req);
  }




}
