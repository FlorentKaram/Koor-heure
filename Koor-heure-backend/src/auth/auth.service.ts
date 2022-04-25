import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {

    }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findForAuth(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...rest } = user;
            return rest;
        }

        return null;
    }

    async login(user: any) {
        const payload = { name: user._doc.name, email: user._doc.email };
        user =  await this.usersService.findOneByEMail(user._doc.email);
        return {
            access_token: this.jwtService.sign(payload),
            user : user
        };
    }
}