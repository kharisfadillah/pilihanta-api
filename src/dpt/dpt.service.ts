import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class DptService {
  constructor(private prisma: PrismaService) {}
  async getDpts(cursor: string, query: string) {
    const pageSize = 20;
    // const skip = (page - 1) * pageSize;

    // // Buat objek filter berdasarkan parameter yang diterima
    const filterObj = query ? { vc_nama: { contains: query } } : {};

    // const [data, total] = await Promise.all([
    //   this.prisma.mst_dpt.findMany({
    //     where: filterObj,
    //     skip,
    //     take: pageSize,
    //   }),
    //   this.prisma.mst_dpt.count({
    //     where: filterObj,
    //   }),
    // ]);

    // const totalPages = Math.ceil(total / pageSize);

    // return {
    //   data: data.map((element: any) => {
    //     return serializeBigInt(element);
    //   }),
    //   meta: {
    //     // current_page: page,
    //     // from: skip + 1,
    //     // to: skip + pageSize,
    //     // per_page: pageSize,
    //     total,
    //     prev_page: page > 1 ? page - 1 : null,
    //     next_page: page < totalPages ? page + 1 : null,
    //   },
    // };

    // if ()

    // const condition = {
    //   where: filterObj,
    //   take: pageSize,
    //   skip: 0,
    //   cursor: undefined,
    //   orderBy: {
    //     nu_id_dpt: 1,
    //   },
    // };

    // let cursor_ = undefined;

    // if (cursor) {
    //   cursor_ = {
    //     nu_id_dpt: parseInt(cursor) ?? undefined,
    //   };
    //   // condition.cursor = {
    //   //   nu_id_dpt: parseInt(cursor),
    //   // };
    //   // condition.skip = 1;
    // }

    const [dpts, total] = await Promise.all([
      this.prisma.mst_dpt.findMany({
        where: filterObj,
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
        where: filterObj,
      }),
    ]);

    // const [data, total] = await Promise.all([
    //   this.prisma.mst_dpt.findMany({
    //     where: filterObj,
    //     skip,
    //     take: pageSize,
    //   }),
    //   this.prisma.mst_dpt.count({
    //     where: filterObj,
    //   }),
    // ]);

    // const dpts = await this.prisma.mst_dpt.findMany({
    //   take: pageSize,
    //   skip: 1,
    //   cursor: {
    //     nu_id_dpt: myCursor,
    //   },
    //   where: filterObj,
    //   orderBy: {
    //     id: 'asc',
    //   },
    // });

    // const totalPages = Math.ceil(total / pageSize);

    const serializedDpts = serializeBigInt(dpts);

    return {
      data: serializedDpts,
      meta: {
        total,
      },
    };
  }
}
