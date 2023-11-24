import { Module } from '@nestjs/common';
import { DptModule } from 'src/dpt/dpt.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    DptModule,
  ],
})
export class AppModule { }
