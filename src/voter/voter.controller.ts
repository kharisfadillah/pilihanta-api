import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { users } from '@prisma/client';
import { VoterService } from './voter.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Controller('voter')
export class VoterController {
  constructor(private voterService: VoterService) {}

  @Get()
  @UseGuards(JwtGuard)
  getVoters(
    @GetUser() user: users,
    @Query('query') query: string,
    @Query('cursor') cursor: string,
  ) {
    return this.voterService.getVoters(user, query, cursor);
  }

  @Post('by-dpt')
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(__dirname, 'images'),
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-imgvoter`;
          cb(null, filename);
        },
      }),
    }),
  )
  createVoterByDpt(
    @GetUser() user: users,
    @Body() dto: CreateVoterDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    dto.image = image.filename;
    return this.voterService.createVoterByDpt(user, dto);
  }
}
