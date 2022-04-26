import { Body, Controller, Get, Post, UseGuards, Request, Delete, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "./user.model";
import { UsersService } from "./users.service";


@Controller('user/admin')
export class UserAdminController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('')
    @ApiBearerAuth('acces-token')
    getAll(@Request() req) {
        return this.usersService.getAll(req.user.email);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':email')
    @ApiBearerAuth('acces-token')
    @ApiParam({ name: 'email' })
    findByEMailAdmin(@Request() req, @Param('email') email: string) {
        return this.usersService.findOneByEMailAdmin(req.user.email, email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('')
    @ApiBearerAuth('acces-token')
    createAdmin(@Request() req, @Body() user: User) {
        return this.usersService.createAdmin(req.user.email, user);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':email')
    @ApiBearerAuth('acces-token')
    @ApiParam({name: 'email'})
    update(@Request() req, @Body() updateUserDto: User, @Param('email') email: string) {
        return this.usersService.updateAdmin(req.user.email, email ,updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':email')
    @ApiBearerAuth('acces-token')
    @ApiParam({ name: 'email' })
    removeAdmin(@Request() req, @Param('email') email: string) {
        return this.usersService.removeAdmin(req.user.email, email);
    }
}