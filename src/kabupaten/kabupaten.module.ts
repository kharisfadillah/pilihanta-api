import { Module } from '@nestjs/common';
import { KabupatenController } from './kabupaten.controller';
import { KabupatenService } from './kabupaten.service';

@Module({
  controllers: [KabupatenController],
  providers: [KabupatenService],
})
export class KabupatenModule {}
