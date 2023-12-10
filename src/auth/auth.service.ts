import { ForbiddenException, Injectable } from '@nestjs/common';
import { ChangePasswordDto, LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/user-response.dto';
import { users } from '@prisma/client';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<UserResponseDto> {
    const user = await this.prisma.users.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('User not registered');

    const pwMatches = await bcrypt.compare(dto.password, user.password);

    if (!pwMatches) throw new ForbiddenException('Credential incorrect');

    const user_ = {
      id: user.id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
    };

    return {
      user: user_,
      token: await this.signToken(user.id.toString(), user.username),
    };
  }

  async me(user: users): Promise<UserResponseDto> {
    const user_ = {
      id: user.id.toString(),
      username: user.username,
      name: user.name,
      role: user.role,
    };

    return {
      user: user_,
      token: null,
    };
  }

  async changePassword(
    user: users,
    dto: ChangePasswordDto,
  ): Promise<UserResponseDto> {
    const userId = user.id;
    const existingUser = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!existingUser) throw new ForbiddenException('Pengguna tidak ditemukan');

    const pwMatches = await bcrypt.compare(
      dto.oldPassword,
      existingUser.password,
    );
    if (!pwMatches) throw new ForbiddenException('Kata sandi lama salah');

    if (dto.oldPassword == dto.newPassword)
      throw new ForbiddenException(
        'Kata sandi baru tidak boleh sama dengan kata sandi lama',
      );

    if (dto.newPassword != dto.confirmPassword)
      throw new ForbiddenException('Kata sandi konfirmasi salah');

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: {
        password: await bcrypt.hash(dto.newPassword, 10),
      },
    });

    const user_ = {
      id: updatedUser.id.toString(),
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role,
    };

    return {
      user: user_,
      token: null,
    };
  }

  async signToken(userId: string, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '365d',
      secret: secret,
    });

    return token;
  }
}
