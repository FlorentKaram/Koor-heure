import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';



export class Position {
  @ApiProperty()
  latitude: String;
  @ApiProperty()
  longitude: String;
}

export class Run {
  @ApiProperty()
  distance: String;

  @ApiProperty()
  duration: String;

  @ApiProperty()
  date: String;

  @ApiProperty()
  speed: String;

  @ApiProperty({ type: [Position] })
  routeCoordinates: Position[]
}

export class User {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  admin: boolean;

  @ApiProperty({ type: [Run] })
  runs: Run[];

}

export type UserDocument = User & Document;

export const RunShema = new mongoose.Schema({
  distance: String,
  duration: String,
  date: String,
  speed: String,
  routeCoordinates: [
    {
      latitude: String,
      longitude: String
    }
  ]
}, { _id: false });

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: {type: Boolean, required: true},
  runs: [RunShema]
});



