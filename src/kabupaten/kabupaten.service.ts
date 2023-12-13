import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class KabupatenService {
  constructor(private prisma: PrismaService) {}
  async get(id: string) {
    const kabupaten = await this.prisma.mst_kab.findMany({
      where: {
        vc_id_provinsi: Number(id),
      },
    });
    return serializeBigInt(kabupaten);
  }
}
