import mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true},
  password: { type: String, required: true },
});

export class loginDTO{
  
    @ApiProperty()
    email: string;
  
    @ApiProperty()
    password: string;
  }