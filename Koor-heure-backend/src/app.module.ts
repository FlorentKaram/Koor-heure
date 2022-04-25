import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

@Module({
  controllers: [],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath : '.env'
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/koorHeureBackend'),
    UsersModule, AuthModule
  ],
})
export class AppModule {}