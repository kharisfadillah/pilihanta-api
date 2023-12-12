import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
import { validate } from 'class-validator';

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

  @Post()
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
  async createVoter(
    @GetUser() user: users,
    @Body() dto: CreateVoterDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    dto.image = image.filename;
    // const errors = await validate(dto);

    // if (errors.length > 0) {
    //   // Jika terdapat kesalahan validasi, lempar pengecualian
    //   const message = errors
    //     .map((error) => Object.values(error.constraints))
    //     .join('-');
    //   throw new HttpException(
    //     { message, error: 'Bad Request' },
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
    return this.voterService.createVoter(user, dto);
  }
}
