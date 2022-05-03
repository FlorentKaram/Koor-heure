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
  async getBestUser(){
    const listUser =  await this.userModel.find();
    let maxUser = listUser[0];
    listUser.forEach(user => {
      if(user.lastRun && maxUser.lastRun.distance < user.lastRun.distance){
        maxUser = user;
      }
    });
    maxUser.password = null;
    return maxUser;
  }

  async findOneByEMail(email: string) {
    let userToReturn = await this.getUser(email);
    userToReturn.password = null;
    return userToReturn;
  }
  async findOneByEMailAdmin(admin : string, email : string){
    await this.isAdmin(admin);
    let userToReturn = await this.getUser(email);
    userToReturn.password = null;
    return userToReturn;
  }

  // create
  async createRootUser() {
    let checkUser = await this.userModel.find();

    for (let index = 0; index < checkUser.length; index++) {
      if(checkUser[index].admin){
        console.log("Root user already exist");
        return;
      }
    }
    let password = await bcrypt.hash(process.env.ROOT_PASSWORD, this.saltOrRounds);

    this.userModel.create({
      name: process.env.ROOT_NAME,
      email: process.env.ROOT_EMAIL,
      password: password,
      admin: true
    }).then(() => console.log("Root user has been created"));
  }


  async create(user: User) {
    await this.isUserExist(user.email);

    let newUser = new this.userModel(user);
    newUser.password = await bcrypt.hash(newUser.password, this.saltOrRounds);
    if (newUser.admin == true) {
      newUser.admin = false;
    }
    const result = await newUser.save();
    result.password = null
    return result;
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
    if(user && email != user.email){      
      await this.isUserExist(user.email);
    }
    if(user.password){
      user.password = await bcrypt.hash(user.password, this.saltOrRounds);
    }
    return this.userModel.findOneAndUpdate({ email: email }, user);
  }
  async updateAdmin(admin : string, emailToUpdate : string, user : User){
    await this.isAdmin(admin);

    if(user.password){
      user.password = await bcrypt.hash(user.password, this.saltOrRounds);
    }
    let check = await this.userModel.exists({email : emailToUpdate});
    if(!check){      
      throw new NotFoundException('User not found');
    }
    if(user.email){
      await this.isUserExist(user.email);
    }
    return this.userModel.findOneAndUpdate({ email: emailToUpdate }, user);
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

  async removeAdmin(adminUser : string, userEmailToDelete : string) {
    await this.isAdmin(adminUser);
    if(adminUser == userEmailToDelete){
      throw new HttpException('You can\'t delete your own account',HttpStatus.CONFLICT);
    }

    let numberOfUser = await this.userModel.count({ admin: true });
    let userToDelete = await this.userModel.findOne({ email: userEmailToDelete });

    if (numberOfUser == 1 && userToDelete.admin) {
      throw new HttpException('You can\'t delete this user (last admin user)', HttpStatus.UNAUTHORIZED);
    }
    let deletedUser = await this.userModel.findOneAndDelete({ email: userEmailToDelete });
    deletedUser.password = null;
    
    return deletedUser;
  }


  // methodes
  async isAdmin(email: String) {
    const userCreator = await this.userModel.findOne({ email: email });
    if (userCreator.admin == false) {
      throw new HttpException('You can\'t use this rout if you\'r not admin ', HttpStatus.UNAUTHORIZED);
    }
  }

  async isUserExist(email: String) {
    const userExist = await this.userModel.findOne({ email: email });
    console.log(userExist)
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
