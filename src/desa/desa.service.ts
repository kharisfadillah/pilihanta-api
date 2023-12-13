import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

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
}
