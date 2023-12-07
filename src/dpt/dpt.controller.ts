import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DptService } from './dpt.service';
import { JwtGuard } from 'src/auth/guard';

@Controller('dpt')
export class DptController {
  constructor(private dptService: DptService) {}

  @Get()
  @UseGuards(JwtGuard)
  getDpts(@Query('cursor') cursor: string, @Query('query') query: string) {
    if (cursor) {
      console.log('ada');
    } else {
      console.log('tidak ada');
    }
    return this.dptService.getDpts(cursor, query);
  }

  //   @Get(':id')
  //   getProvinceById(@Param('id', ParseIntPipe) provinceId: number) {
  //     return this.provinceService.getProvinceById(provinceId)
  //   }

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
