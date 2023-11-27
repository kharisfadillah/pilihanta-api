import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { LoginDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) { }


  async login(dto: LoginDto) {
    const user = await this.prisma.users.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (!user) throw new ForbiddenException('User not registered');

    const pwMatches = await argon.verify(user.password, dto.password);

    if (!pwMatches) throw new ForbiddenException('Credential incorrect');

    // delete user.hash;

    return this.signToken(user.id, user.username);
  }

  async signToken(
    userId: bigint,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '365d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}