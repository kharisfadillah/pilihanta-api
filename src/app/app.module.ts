import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DptModule } from 'src/dpt/dpt.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DptModule,
  ],
})
export class AppModule { }
