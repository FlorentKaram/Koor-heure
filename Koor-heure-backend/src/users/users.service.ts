import { HttpException, HttpStatus, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  saltOrRounds = 10;
  constructor(@InjectModel('users') private readonly userModel: Model<User>) { }

  //get
  async getAll(email: string) {
    await this.isAdmin(email);
    let listUser = await this.userModel.find();
    listUser.forEach(user => {
      user.password = null;
    });
    return listUser;
  }


  async findOneByEMail(email: string) {
    let userToReturn = await this.getUser(email);
    userToReturn.password = null;
    return userToReturn;
  }

  // create
  async createRootUser() {
    let password = await bcrypt.hash(process.env.ROOT_PASSWORD, this.saltOrRounds);

    this.userModel.create({
      name: process.env.ROOT_NAME,
      email: process.env.ROOT_EMAIL,
      password: password,
      admin: true
    }).then(() => console.log("Root user has been created"))
      .catch(() => console.log("Root user already existe"));
  }


  async create(user: User) {
    await this.isUserExist(user.email);

    let newUser = new this.userModel(user);
    newUser.password = await bcrypt.hash(newUser.password, this.saltOrRounds);
    if (newUser.admin == true) {
      newUser.admin = false;
    }
    const result = await newUser.save();

    return result.id;
  }

  async createAdmin(creator: String, user: User) {
    await this.isAdmin(creator);
    await this.isUserExist(user.email);

    let newUser = new this.userModel(user);
    newUser.password = await bcrypt.hash(newUser.password, this.saltOrRounds);
    const result = await newUser.save();

    return result.id;
  }

  // Update
  async update(email: string, user: User) {
    if (email != user.email) {
      await this.isUserExist(email);
    }
    this.isUserExist(email);

    user.password = await bcrypt.hash(user.password, this.saltOrRounds);
    return this.userModel.findOneAndUpdate({ email: email }, user);
  }

  //delete
  async remove(email: string) {
    await this.getUser(email);

    let deletedUser = await this.userModel.findOneAndDelete({ email: email, admin: false });
    if (!deletedUser) {
      throw new NotFoundException('You can\'t delete admin user. Please use => user/admin/:{email}');
    }
    deletedUser.password = null;
    return deletedUser;
  }

  async removeAdmin(adminUser, userToDelete) {
    await this.isAdmin(adminUser);

    let numberOfUser = await this.userModel.count({ admin: true });
    if (numberOfUser == 1 && userToDelete.admin == true) {
      throw new HttpException('You can\'t delete this user (last admin user)', HttpStatus.UNAUTHORIZED);
    }

    let deletedUser = await this.userModel.findOneAndDelete({ email: userToDelete });
    deletedUser.password = null;
    return deletedUser;
  }


  // methodes
  async isAdmin(email: String) {
    const userCreator = await this.userModel.findOne({ email: email });
    if (userCreator.admin == false) {
      throw new HttpException('You can\'t use this rout if you\'r not admin ', HttpStatus.UNAUTHORIZED);
      return true;
    }
  }

  async isUserExist(email: String) {
    const userExist = await this.userModel.findOne({ email: email });
    if (userExist) {
      throw new HttpException('Email already exist', HttpStatus.FORBIDDEN);
    }
  }

  async getUser(email: String) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findForAuth(email: string) {
    let userToReturn = await this.getUser(email);
    return userToReturn;
  }
}
