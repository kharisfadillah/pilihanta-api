import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { DesaModule } from 'src/desa/desa.module';
import { DptModule } from 'src/dpt/dpt.module';
import { KabupatenModule } from 'src/kabupaten/kabupaten.module';
import { KecamatanModule } from 'src/kecamatan/kecamatan.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProvinsiModule } from 'src/provinsi/provinsi.module';
import { RelawanModule } from 'src/relawan/relawan.module';
import { VoterModule } from 'src/voter/voter.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DptModule,
    RelawanModule,
    VoterModule,
    ProvinsiModule,
    KabupatenModule,
    KecamatanModule,
    DesaModule,
  ],
})
export class AppModule {}
