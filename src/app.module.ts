import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './utils/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.main.host'),
        port: configService.get('database.main.port'),
        username: configService.get('database.main.username'),
        password: configService.get('database.main.password'),
        database: configService.get('database.main.database'),
        entities: ['dist/**/*.entity.js'],
        logging: true,
      }),
      inject: [ConfigService],
      
    }),
    AuthModule,
    UserModule,
    // SocketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
