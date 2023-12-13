import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { DesaService } from './desa.service';

@Controller('desa')
export class DesaController {
  constructor(private desaService: DesaService) {}

  @Get()
  @UseGuards(JwtGuard)
  get(@Query('kecamatan') idKecamatan: string) {
    return this.desaService.get(idKecamatan);
  }
}
