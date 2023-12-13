import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class ProvinsiService {
  constructor(private prisma: PrismaService) {}
  async get() {
    const provinsi = await this.prisma.mst_prov.findMany();
    return serializeBigInt(provinsi);
  }
}
