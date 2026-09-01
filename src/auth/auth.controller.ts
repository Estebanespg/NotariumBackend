import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @ApiOperation({ summary: 'Register new user' })
	@ApiResponse({
		status: 201,
		description: 'User successfully registered',
	})
	@ApiResponse({ status: 400, description: 'Bad Request' })
	@ApiResponse({
		status: 409,
		description: 'Conflict - Username already exists',
	})
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  @Public()
  @ApiOperation({ summary: 'Authenticate as user' })
	@ApiResponse({
		status: 200,
		description: 'Login successful',
	})
	@ApiResponse({ status: 401, description: 'Unauthorized' })
  signIn(@Body() loginUserDto: LoginUserDto) {
    return this.authService.signIn(loginUserDto);
  }
}
