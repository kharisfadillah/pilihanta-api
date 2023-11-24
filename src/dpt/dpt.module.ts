import { Module } from '@nestjs/common';
import { DptController } from './dpt.controller';
import { DptService } from './dpt.service';

@Module({
  controllers: [DptController],
  providers: [DptService]
})
export class DptModule { }