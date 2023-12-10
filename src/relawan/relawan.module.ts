import { Module } from '@nestjs/common';
import { RelawanController } from './relawan.controller';
import { RelawanService } from './relawan.service';

@Module({
  controllers: [RelawanController],
  providers: [RelawanService],
})
export class RelawanModule {}
