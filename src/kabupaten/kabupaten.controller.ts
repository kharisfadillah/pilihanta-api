import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { KabupatenService } from './kabupaten.service';

@Controller('kabupaten')
export class KabupatenController {
  constructor(private kabupatenService: KabupatenService) {}

  @Get()
  @UseGuards(JwtGuard)
  get(@Query('provinsi') idProvinsi: string) {
    return this.kabupatenService.get(idProvinsi);
  }
}
