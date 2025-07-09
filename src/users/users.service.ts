import {
  Inject,
  Injectable,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoProvider } from '../libs/crypto/ports/crypto.provider';
import { Model } from 'mongoose';
import { User } from '../database/schemas/user.schema';
import { OutputUserDto } from './dto/output-user.dto';
import { LOGGER_PROVIDER } from '../libs/logger/logger-provider.const';
import { Types } from 'mongoose';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CryptoProvider) private cryptoProvider: CryptoProvider,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    const user = await this.userModel.create({
      ...createUserDto,
      password: await this.cryptoProvider.hash(createUserDto.password),
      accountId: new Types.ObjectId(createUserDto.accountId),
    });
    this.logger.log(`User ${createUserDto.email} created with id: ${user._id}`);
    return new OutputUserDto(user.toObject());
  }

  async findAll() {
    this.logger.log('Fetching all users');
    const [users, total] = await Promise.all([
      this.userModel.find().exec(),
      this.userModel.countDocuments().exec(),
    ]);
    this.logger.log(`Total users found: ${total}`);
    return {
      total,
      users: users.map((user) => new OutputUserDto(user.toObject())),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      this.logger.warn(`User with id: ${id} not found`);
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    this.logger.log(`User with id: ${id} found`);
    return new OutputUserDto(user.toObject());
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.cryptoProvider.hash(
        updateUserDto.password,
      );
    }
    this.logger.log(`Updating user with id: ${id}`);
    return this.userModel
      .findByIdAndUpdate(id, { $set: updateUserDto }, { new: true })
      .then((user) => {
        if (!user) {
          this.logger.warn(`User with id: ${id} not found for update`);
          throw new NotFoundException(`User with id: ${id} not found`);
        }
        this.logger.log(`User with id: ${id} updated successfully`);
        return new OutputUserDto(user.toObject());
      });
  }

  async remove(id: string) {
    this.logger.log(`Removing user with id: ${id}`);
    await this.userModel.deleteOne({ _id: id });
  }
}
