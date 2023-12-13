import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ProvinsiService } from './provinsi.service';

@Controller('provinsi')
export class ProvinsiController {
  constructor(private provinsiService: ProvinsiService) {}

  @Get()
  @UseGuards(JwtGuard)
  get() {
    return this.provinsiService.get();
  }
}
