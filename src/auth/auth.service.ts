import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name?: string) {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already exists');

    return this.usersService.createUser(email, password, name);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ userId: user._id.toString(), email: user.email });

    return { accessToken: token };
  }
  
}
