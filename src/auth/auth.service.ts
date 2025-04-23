import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { comparePassword } from '../utils/helpers/generic.helper';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ERROR_MESSAGES } from 'src/utils/constants/messages.constants';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { }
  async validateUser(
    email: string,
    pass: string,
    role: Role,
  ): Promise<any> {
    const user:any = await this.userService.filterUser({
      email: email,
      isDeleted: false,
    });
    if (!user) {
      throw new ForbiddenException(ERROR_MESSAGES.USER['002']);
    }
    if (user) {
      const matchPassword = comparePassword(pass, user.password);
      if (matchPassword) {
        delete user.password;
        return user;
      }

      throw new ForbiddenException(ERROR_MESSAGES.USER['004']);
    }
  }
  async login(payload: any) {
    return {
      access_token: this.jwtService.sign({ ...payload }),
    };
  }

}
