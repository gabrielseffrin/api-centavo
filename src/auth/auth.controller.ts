import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body('email') email: string, @Body('password') password: string, @Body('name') name: string) {
        const newUser = await this.authService.register(email, password, name);
        return {
            user: newUser
        };
    }

    @Post('login')
    @ApiBody({ type: LoginDto})
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDto) {
        const jwt = await this.authService.login(loginDto.email, loginDto.password);
        return {
            jwt
        };
    }
}
