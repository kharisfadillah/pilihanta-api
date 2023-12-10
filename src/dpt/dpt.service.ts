import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class DptService {
  constructor(private prisma: PrismaService) {}
  async getDpts(desa: string, rt: string, query: string, cursor: string) {
    const pageSize = 20;

    // Buat objek untuk menyimpan kondisi query
    const whereCondition: any = {
      AND: [
        {
          vc_id_desa: desa,
        },
      ],
    };

    // Tambahkan vc_rt jika rt telah diberikan
    if (rt) {
      whereCondition.AND.push({
        vc_rt: rt,
      });
    }

    // Tambahkan kondisi OR hanya jika query telah diberikan
    if (query) {
      const orCondition = {
        OR: [{ vc_nik: { contains: query } }, { vc_nama: { contains: query } }],
      };
      whereCondition.AND.push(orCondition);
    }

    //cek variabel whereCondition
    console.log(
      whereCondition,
      whereCondition.AND[2],
      whereCondition.AND[2].OR[0],
      whereCondition.AND[2].OR[1],
    );

    // query prisma untuk menampilkan data dan total
    const [dpts, total] = await Promise.all([
      this.prisma.mst_dpt.findMany({
        where: whereCondition,
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor
          ? {
              nu_id_dpt: parseInt(cursor) ?? undefined,
            }
          : undefined,
        orderBy: {
          nu_id_dpt: 'asc',
        },
      }),
      this.prisma.mst_dpt.count({
        where: whereCondition,
      }),
    ]);

    // hasil query perlu diserialize agar tidak error
    const serializedDpts = serializeBigInt(dpts);

    return {
      data: serializedDpts,
      meta: {
        total,
      },
    };
  }
}
