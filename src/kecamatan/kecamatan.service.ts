import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class KecamatanService {
  constructor(private prisma: PrismaService) {}
  async get(id: string) {
    const kecamatan = await this.prisma.mst_kec.findMany({
      where: {
        vc_id_kabupaten: Number(id),
      },
    });
    return serializeBigInt(kecamatan);
  }
}
