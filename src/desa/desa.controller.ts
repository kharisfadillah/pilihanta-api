import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { DesaService } from './desa.service';
import { GetUser } from 'src/auth/decorator';
import { users } from '@prisma/client';

@Controller('desa')
export class DesaController {
  constructor(private desaService: DesaService) {}

  @Get()
  @UseGuards(JwtGuard)
  get(@Query('kecamatan') idKecamatan: string) {
    return this.desaService.get(idKecamatan);
  }

  @Get('by-user')
  @UseGuards(JwtGuard)
  getByUser(@GetUser() user: users) {
    return this.desaService.getByUser(user);
  }
}
