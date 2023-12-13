import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { KecamatanService } from './kecamatan.service';

@Controller('kecamatan')
export class KecamatanController {
  constructor(private kecamatanService: KecamatanService) {}

  @Get()
  @UseGuards(JwtGuard)
  get(@Query('kabupaten') idKabupaten: string) {
    return this.kecamatanService.get(idKabupaten);
  }
}
