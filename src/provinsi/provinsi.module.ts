import { Module } from '@nestjs/common';
import { ProvinsiController } from './provinsi.controller';
import { ProvinsiService } from './provinsi.service';

@Module({
  controllers: [ProvinsiController],
  providers: [ProvinsiService],
})
export class ProvinsiModule {}
