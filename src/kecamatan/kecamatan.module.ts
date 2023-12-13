import { Module } from '@nestjs/common';
import { KecamatanController } from './kecamatan.controller';
import { KecamatanService } from './kecamatan.service';

@Module({
  controllers: [KecamatanController],
  providers: [KecamatanService],
})
export class KecamatanModule {}
