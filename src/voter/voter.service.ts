import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';
import { users } from '@prisma/client';
import { CreateRelawanDto } from './dto/create-relawan.dto';

@Injectable()
export class VoterService {
  constructor(private prisma: PrismaService) {}
  async getVoters(user: users, query: string, cursor: string) {
    const pageSize = 20;

    // Buat objek untuk menyimpan kondisi query
    const whereCondition: any = {
      AND: [
        {
          vc_id_relawan: user.id.toString(),
        },
      ],
    };

    // Tambahkan kondisi OR hanya jika query telah diberikan
    if (query) {
      const orCondition = {
        OR: [{ vc_nik: { contains: query } }, { vc_nama: { contains: query } }],
      };
      whereCondition.AND.push(orCondition);
    }

    //cek variabel whereCondition
    console.log(whereCondition, whereCondition.AND[0], whereCondition.AND[1]);

    // query prisma untuk menampilkan data dan total
    const [relawans, total] = await Promise.all([
      this.prisma.relawans.findMany({
        where: whereCondition,
        take: pageSize,
        skip: cursor ? 1 : 0,
        cursor: cursor
          ? {
              nu_id: parseInt(cursor) ?? undefined,
            }
          : undefined,
        orderBy: {
          nu_id: 'asc',
        },
      }),
      this.prisma.relawans.count({
        where: {
          created_by: user.id.toString(),
        },
      }),
    ]);

    // hasil query perlu diserialize agar tidak error
    const serializedDpts = serializeBigInt(relawans);

    return {
      data: serializedDpts,
      meta: {
        total,
      },
    };
  }

  async createRelawan(user: users, dto: CreateRelawanDto) {
    const now = new Date();

    const relawan = await this.prisma.relawans.create({
      data: {
        vc_nik: dto.nik,
        vc_nama: dto.nama,
        vc_alamat: dto.alamat,
        vc_no_hp: dto.noHP,
        vc_no_rek: dto.noRekening,
        vc_bank: dto.bank,
        vc_atas_nama: dto.atasNama,
        vc_jenis_relawan: dto.jenisRelawan,
        created_by: user.id.toString(),
        created_at: now,
        updated_at: now,
      },
    });
    return relawan;
  }

  async getJenisRelawan(user: users) {
    const relawan = await this.prisma.relawans.findUnique({
      where: {
        nu_id: Number(user.id),
      },
    });

    console.log(relawan);
    const jenisRelawan: string[] = [];
    switch (relawan.vc_jenis_relawan) {
      case 'korkab':
        jenisRelawan.push('korcam');
        break;
      case 'korcam':
        jenisRelawan.push('kordes');
        jenisRelawan.push('dtdc');
        break;
      case 'kordes':
        jenisRelawan.push('dtdc');
        break;
    }

    return jenisRelawan;
  }
}
