import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { RegisterUser } from './register-user';
import { LibsModule } from '../libs/libs.module';
import { SignupRepository } from './entities/signup.repository';
import { MongooseSignupRepository } from '../database/repositories/mongoose-signup-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from '../database/schemas/account.schema';
import { User, UserSchema } from '../database/schemas/user.schema';

@Module({
  imports: [
    LibsModule,
    MongooseModule.forFeature([
      { name: Account.name, schema: AccountSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [SignupController],
  providers: [
    RegisterUser,
    { provide: SignupRepository, useClass: MongooseSignupRepository },
  ],
})
export class SignupModule {}
