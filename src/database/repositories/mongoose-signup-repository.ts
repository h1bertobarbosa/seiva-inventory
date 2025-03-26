import { InjectModel } from '@nestjs/mongoose';
import { Signup } from '../../signup/entities/signup.entity';
import { SignupRepository } from '../../signup/entities/signup.repository';
import { Model } from 'mongoose';
import { Account } from '../schemas/account.schema';
import { User } from '../schemas/user.schema';

export class MongooseSignupRepository implements SignupRepository {
  constructor(
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async existsByDocument(document: string): Promise<boolean> {
    const total = await this.accountModel.countDocuments({ document });
    return total > 0;
  }
  async save(signup: Signup): Promise<Signup> {
    const account = await this.accountModel.create({
      name: signup.companyName,
      email: signup.companyEmail,
      document: signup.companyDocument,
    });
    const user = await this.userModel.create({
      name: signup.name,
      email: signup.email,
      password: signup.password,
      accountId: account._id,
    });
    return Signup.getInstance({
      ...signup,
      companyId: account._id.toString(),
      userId: user._id.toString(),
    });
  }
}
