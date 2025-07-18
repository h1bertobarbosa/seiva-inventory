import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignupModule } from './signup/signup.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SigninModule } from './signin/signin.module';
import { InventoryModule } from './inventory/inventory.module';
import { SessionModule } from './session/session.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (environmentsService: ConfigService) => ({
        uri: environmentsService.get('DB_URI'),
      }),
      inject: [ConfigService],
    }),
    SignupModule,
    SigninModule,
    InventoryModule,
    SessionModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
