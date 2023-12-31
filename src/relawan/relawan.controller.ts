import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { RelawanService } from './relawan.service';
import { GetUser } from 'src/auth/decorator';
import { users } from '@prisma/client';
import { CreateRelawanDto } from './dto';
import { ApiConsumes } from '@nestjs/swagger';

@Controller('relawan')
export class RelawanController {
  constructor(private relawanService: RelawanService) {}

  @Get()
  @UseGuards(JwtGuard)
  getRelawans(
    @GetUser() user: users,
    @Query('query') query: string,
    @Query('cursor') cursor: string,
  ) {
    return this.relawanService.getRelawans(user, query, cursor);
  }

  @Post()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  createRelawans(@GetUser() user: users, @Body() dto: CreateRelawanDto) {
    return this.relawanService.createRelawan(user, dto);
  }

  @Get('jenis')
  @UseGuards(JwtGuard)
  getJenisRelawan(@GetUser() user: users) {
    return this.relawanService.getJenisRelawan(user);
  }

  @Get('check-user-name')
  @UseGuards(JwtGuard)
  checkUsername(@Query('username') username: string) {
    return this.relawanService.checkUsername(username);
  }

  @Get('sarankan-user-name')
  @UseGuards(JwtGuard)
  sarankanUsername(@Query('name') name: string) {
    return this.relawanService.sarankanUsername(name);
  }
}
