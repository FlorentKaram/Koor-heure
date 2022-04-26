import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { UserAdminController } from './user-admin.controller';


@Module({
  controllers: [UsersController,UserAdminController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [MongooseModule.forFeature([{ name: 'users', schema: UserSchema }])]
})
export class UsersModule { }
