import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DptService } from './dpt.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('dpt')
export class DptController {
  constructor(private dptService: DptService) {}

  @Get()
  @UseGuards(JwtGuard)
  getDpts(
    @Query('desa') desa: string,
    @Query('rt') rt: string,
    @Query('query') query: string,
    @Query('cursor') cursor: string,
  ) {
    return this.dptService.getDpts(desa, rt, query, cursor);
  }

  @Get('by-nik/:nik')
  getDptByNik(@Param('nik', ParseIntPipe) nik: string) {
    return this.dptService.getDptByNik(nik);
  }

  //   @Post()
  //   createProvince(@GetUser('id') createdId: number, @Body() dto: CreateProvinceDto) {
  //     return this.provinceService.createProvince(createdId, dto)
  //   }

  //   @Patch(':id')
  //   editProvince(
  //     @GetUser('id') userId: number,
  //     @Param('id', ParseIntPipe) provinceId: number,
  //     @Body() dto: EditProvinceDto,
  //   ) {
  //     return this.provinceService.editProvince(userId, provinceId, dto)
  //   }

  //   @HttpCode(HttpStatus.NO_CONTENT)
  //   @Delete(':id')
  //   deleteProvince(@Param('id', ParseIntPipe) provinceId: number) {
  //     return this.provinceService.deleteProvince(provinceId)
  //   }
}
