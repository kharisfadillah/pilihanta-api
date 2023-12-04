import { Controller, Get, Query } from '@nestjs/common';
import { DptService } from './dpt.service';

@Controller('dpt')
export class DptController {
  constructor(private dptService: DptService) {}

  @Get()
  getDpts(@Query('page') page: string, @Query('query') query: string) {
    const pageNumber = parseInt(page);
    return this.dptService.getDpts(isNaN(pageNumber) ? 1 : pageNumber, query);
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
