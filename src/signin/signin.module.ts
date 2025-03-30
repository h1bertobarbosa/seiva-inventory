import { Module } from '@nestjs/common';
import { SigninService } from './signin.service';
import { SigninController } from './signin.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../database/schemas/user.schema';
import { LibsModule } from '../libs/libs.module';

@Module({
  imports: [
    LibsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (environmentsService: ConfigService) => ({
        secret: environmentsService.get('JWT_SECRET'),
        global: true,
        signOptions: { expiresIn: '8h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SigninController],
  providers: [
    SigninService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class SigninModule {}
