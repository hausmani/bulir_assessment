import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,ForbiddenException,
  HttpStatus
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ERROR_MESSAGES } from 'src/utils/constants/messages.constants';
import { Role } from 'src/auth/enums/role.enum';
import { log } from 'console';

@Injectable()
export class UserService {
  genericFunctions: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create({
        ...createUserDto,
      });

      return this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }


  filterUser(options: {}) {
    try {
      return this.userRepository.findOne({
        where: options,
        select: [
          'id',
          'firstName',
          'lastName',
          'email',
          'password',
          'role',
          'passExpiryTime',
          'passVerificationCode',
        ],
      });
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.COMMON['001']);
    }
  }
  

  findUsers() {
    try {
      return this.userRepository
        .findAndCount({
          select: [
            'id',
            'firstName',
            'lastName',
            'email',
            'password',
            'role',
            'passExpiryTime',
            'passVerificationCode',
          ],
        })
        .then((res) => {
          if (res) return res;
          else throw new NotFoundException(ERROR_MESSAGES.USER['002']);
        });
    } catch (error) {
      throw new InternalServerErrorException(ERROR_MESSAGES.COMMON['001']);
    }
  }

  async getTaskById(id: string, req: any) {
    try {
      
      // Simulated tasks data
      const tasks = [
        { id: '1', title: 'Task One', userId: '1', description: 'Clean the house', dueDate: '2025-05-01' },
        { id: '2', title: 'Task Two', userId: '2', description: 'Fix the sink', dueDate: '2025-05-03' },
        { id: '3', title: 'Task Three', userId: '3', description: 'Paint the wall', dueDate: '2025-05-05' },
        { id: '4', title: 'Task Four', userId: '4', description: 'Mow the lawn', dueDate: '2025-05-07' },
      ];

      const task = tasks.find(t => t.id === id);

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      if (req.user.role === Role.Client && task.userId != req.user.id) {
        throw new ForbiddenException('You do not have permission to access this task');
      }

      return {
        data: task,
        status: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      console.error('Unexpected error in getTaskById:', error);
      throw new InternalServerErrorException('Something went wrong');
    }
  }


  async getBookingdataByUser(req: any) {
    const allBookings = [
      { id: 'b1', service: 'Cleaning', userId: '1' },
      { id: 'b2', service: 'Plumbing', userId: '2' },
      { id: 'b3', service: 'Electrical', userId: '3' },
      { id: 'b4', service: 'Cleaning', userId: '1' },
      { id: 'b5', service: 'Plumbing', userId: '2' },
      { id: 'b6', service: 'Electrical', userId: '3' },
      { id: 'b4', service: 'Cleaning', userId: '4' },
      { id: 'b5', service: 'Plumbing', userId: '6' },
      { id: 'b6', service: 'Electrical', userId: '6' },
    ];

    // Filter bookings for this user only-- user 1 hardcoded
    const userBookings = allBookings.filter(b => b.userId == req.user.id);
    if (userBookings.length == 0) {
      throw new NotFoundException('No bookings found for this user');
    }

    return {
      data: userBookings,
      status: HttpStatus.OK,
    };

  }


}
 