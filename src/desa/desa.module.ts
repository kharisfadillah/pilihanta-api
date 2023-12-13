import { Module } from '@nestjs/common';
import { DesaController } from './desa.controller';
import { DesaService } from './desa.service';

@Module({
  controllers: [DesaController],
  providers: [DesaService],
})
export class DesaModule {}
