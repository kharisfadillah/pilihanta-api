import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVoterDto {
  @ApiProperty()
  @IsString()
  idDpt: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'NIK tidak boleh kosong',
  })
  nik: string;

  @ApiProperty()
  @IsString()
  nama: string;

  @ApiProperty()
  @IsString()
  alamat: string;

  @ApiProperty()
  @IsString()
  idProvinsi: string;

  @ApiProperty()
  @IsString()
  idKabupaten: string;

  @ApiProperty()
  @IsString()
  idKecamatan: string;

  @ApiProperty()
  @IsString()
  idDesa: string;

  @ApiProperty()
  @IsString()
  rt: string;

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
