import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiProperty } from "@nestjs/swagger";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { LocalAuthGuard } from "./local-auth.guard";
import { loginDTO } from "./auth.model";

@Controller()
export class AuthController{
    constructor(private readonly authService: AuthService, userService : UsersService){}

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req, @Body() loginDTO: loginDTO) {
      return this.authService.login(req.user)  ;
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('acces-token')
    getProfile(@Request() req) { 
      return req.user;
    }
}