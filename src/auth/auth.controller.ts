import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorator';
import { users } from '@prisma/client';
import { JwtGuard } from './guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtGuard)
  me(@GetUser() user: users) {
    return this.authService.me(user);
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  changePassword(@GetUser() user: users, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user, dto);
  }
}
