import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRelawanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(16, 16, {
    message: 'NIK harus 16 karakter',
  })
  nik: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Nama tidak boleh kosong',
  })
  nama: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Username tidak boleh kosong',
  })
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Alamat tidak boleh kosong',
  })
  alamat: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'No HP tidak boleh kosong',
  })
  noHP: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'No Rekening tidak boleh kosong',
  })
  noRekening: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Bank tidak boleh kosong',
  })
  bank: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Atas Nama tidak boleh kosong',
  })
  atasNama: string;

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

  //   @ApiProperty()
  //   @IsString()
  //   penempatanProvinsi: string;

  //   @ApiProperty()
  //   @IsString()
  //   penempatanKabupaten: string;

  //   @ApiProperty()
  //   @IsString()
  //   penempatanKecamatan: string;

  //   @ApiProperty()
  //   @IsString()
  //   penempatanDesa: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Tingkat Relawan tidak boleh kosong',
  })
  tingkatRelawan: string;

  @ApiProperty()
  @IsString()
  penempatan: string;

  @ApiProperty()
  @IsString()
  target: string;
}
