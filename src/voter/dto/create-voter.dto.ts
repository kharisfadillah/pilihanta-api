import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idDpt: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'No HP tidak boleh kosong',
  })
  noHP: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Vote tidak boleh kosong',
  })
  vote: string;

  @ApiProperty()
  @IsString()
  lat: string;

  @ApiProperty()
  @IsString()
  long: string;

  @IsString()
  @IsOptional()
  image: string;
}
