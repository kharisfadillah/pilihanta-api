import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';
import { users } from '@prisma/client';

@Injectable()
export class DesaService {
  constructor(private prisma: PrismaService) {}
  async get(id: string) {
    const desa = await this.prisma.mst_desa.findMany({
      where: {
        vc_id_kecamatan: Number(id),
      },
    });
    return serializeBigInt(desa);
  }

  async getByUser(user: users) {
    const relawanAssign = await this.prisma.relawan_assign.findFirst({
      where: {
        vc_id_rel: user.vc_id_rel,
      },
    });

    if (!relawanAssign) {
      throw new ForbiddenException('Relawan tidak terdaftar');
    }

    if (relawanAssign.vc_id_kecamatan == null) {
      throw new ForbiddenException('Anda tidak bisa mendaftarkan relawan ini');
    }

    const desa = await this.prisma.mst_desa.findMany({
      where: {
        vc_id_kecamatan: Number(relawanAssign.vc_id_kecamatan),
      },
    });
    return serializeBigInt(desa);
  }
}
