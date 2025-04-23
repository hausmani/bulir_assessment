import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { enCodePassword } from 'src/utils/helpers/generic.helper';

@Injectable()
export class AdminSeeder implements Seeder {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<any> {
    const email = this.configService.get('seed.admin.email');
    const existing = await this.userRepository.findOneBy({ email });

    if (existing) {
      console.log('⚠️ Admin already exists');
      return;
    }

    const adminSeedData = {
      firstName: this.configService.get('seed.admin.firstName'),
      lastName: this.configService.get('seed.admin.lastName'),
      email,
      password: enCodePassword(this.configService.get('seed.admin.password') || 'default123'),
      role: this.configService.get('seed.admin.role') || 'ADMIN',
    };

    const adminData = this.userRepository.create(adminSeedData);
    await this.userRepository.save(adminData);

    console.log('✅ Admin seeded successfully');
  }

  async drop(): Promise<any> {
    return this.userRepository.clear();
  }
}
