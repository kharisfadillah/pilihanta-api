import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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
      // whereCondition.AND[2],
      // whereCondition.AND[2].OR[0],
      // whereCondition.AND[2].OR[1],
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

  async getDptByNik(nik: string) {
    console.log(`nik: ${nik}`);
    const dpt = await this.prisma.mst_dpt.findFirst({
      where: {
        vc_nik: String(nik),
      },
    });

    console.log(dpt);

    if (!dpt) {
      throw new NotFoundException('Data DPT tidak ditemukan');
    }

    const provinsi = await this.prisma.mst_prov.findFirst({
      where: {
        vc_id_provinsi: dpt.vc_id_provinsi,
      },
    });

    const kabupaten = await this.prisma.mst_kab.findFirst({
      where: {
        vc_id_kabupaten: dpt.vc_id_kabupaten,
      },
    });

    const kecamatan = await this.prisma.mst_kec.findFirst({
      where: {
        vc_id_kecamatan: dpt.vc_id_kecamatan,
      },
    });

    const desa = await this.prisma.mst_desa.findFirst({
      where: {
        vc_id_desa: dpt.vc_id_desa,
      },
    });

    const serializedProvinsi = serializeBigInt(provinsi);
    const serializedKabupaten = serializeBigInt(kabupaten);
    const serializedKecamatan = serializeBigInt(kecamatan);
    const serializedDesa = serializeBigInt(desa);

    return {
      nu_id_dpt: dpt.nu_id_dpt.toString(),
      vc_nik: dpt.vc_nik,
      vc_nkk: dpt.vc_nkk,
      vc_nama: dpt.vc_nama,
      vc_alamat: dpt.vc_alamat,
      vc_tempat_lahir: dpt.vc_tempat_lahir,
      dt_tgl_lahir: dpt.dt_tgl_lahir,
      vc_jenis_kel: dpt.vc_jenis_kel,
      vc_status_kawin: dpt.vc_status_kawin,
      vc_id_provinsi: dpt.vc_id_provinsi,
      vc_id_kabupaten: dpt.vc_id_kabupaten,
      vc_id_kecamatan: dpt.vc_id_kecamatan,
      vc_id_desa: dpt.vc_id_desa,
      vc_rt: dpt.vc_rt,
      vc_id_tps: dpt.vc_id_tps,
      vc_no_hp: dpt.vc_no_hp,
      vc_verify: dpt.vc_verify,
      vc_recruit_by: dpt.vc_recruit_by,
      nu_id_reff: dpt.nu_id_reff,
      vc_status: dpt.vc_status,
      updated_at: dpt.updated_at,
      created_at: dpt.created_at,
      provinsi: serializedProvinsi,
      kabupaten: serializedKabupaten,
      kecamatan: serializedKecamatan,
      desa: serializedDesa,
    };
  }
}
