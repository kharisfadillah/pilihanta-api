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
  @IsNotEmpty({
    message: 'Jenis Relawan tidak boleh kosong',
  })
  jenisRelawan: string;
}
