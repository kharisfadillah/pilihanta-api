import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { DptModule } from 'src/dpt/dpt.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RelawanModule } from 'src/relawan/relawan.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DptModule,
    RelawanModule,
  ],
})
export class AppModule {}
