import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { User } from './user.model';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { request } from 'http';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // New user route
  @Post()
  create(@Body() createUserDto: User){
    return this.usersService.create(createUserDto);
  }

  // Route for all user
  @UseGuards(JwtAuthGuard)
  @Get('')
  @ApiBearerAuth('acces-token')
  findByEMail (@Request() req){
    return this.usersService.findOneByEMail(req.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('')
  @ApiBearerAuth('acces-token')
  update(@Request() req, @Body() updateUserDto: User) {
    return this.usersService.update(req.user.email, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('')
  @ApiBearerAuth('acces-token')
  remove(@Request() req) {
    return this.usersService.remove(req.user.email);
  }

  // Admin root 
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  @ApiBearerAuth('acces-token')
  createAdmin(@Request() req,@Body() user: User){
    return this.usersService.createAdmin(req.user.email,user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  @ApiBearerAuth('acces-token')
  getAll(@Request() req){
    return this.usersService.getAll(req.user.email);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('admin/:email')
  @ApiBearerAuth('acces-token')
  @ApiParam({name: 'email'})
  removeAdmin(@Request() req,@Param('email') email : string) {
    return this.usersService.removeAdmin(req.user.email, email);
  }
}
