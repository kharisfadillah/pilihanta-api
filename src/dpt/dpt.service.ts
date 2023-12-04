import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class DptService {
  constructor(private prisma: PrismaService) { }
  async getDpts(page: number, query: string) {
    const pageSize = 20;
    // const skip = (page - 1) * pageSize;

    // // Buat objek filter berdasarkan parameter yang diterima
    const filterObj = query ? { vc_nama: { startsWith: query } } : {};

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

    // const dpts = await this.prisma.mst_dpt.findMany({
    //   where: filterObj,
    //   take: pageSize,
    // });
    // // console.log(dpts);

    // const serializedDpts = serializeBigInt(dpts);

    // return serializedDpts;

    const dpts = await this.prisma.$queryRaw`
  SELECT * FROM mst_dpt
  WHERE vc_nama LIKE ${query ? '%' + query + '%' : '%'}
  LIMIT ${pageSize};
`;

    const serializedDpts = serializeBigInt(dpts);

    return serializedDpts;
  }
}
