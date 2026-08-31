import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      const payload = { sub: user.id, email: user.email };
      const access_token = await this.jwtService.signAsync(payload);
      return {
        user: {
          id: user.id,
          email: user.email,
        },
        access_token,
      };
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        throw new ConflictException('The email is already registered');
      }
      throw new InternalServerErrorException('Error registering user');
    }
  }

  async signIn(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    let user;

    try {
      user = await this.usersService.findOne(loginUserDto.email);
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
