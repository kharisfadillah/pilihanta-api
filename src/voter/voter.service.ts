import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';
import { users } from '@prisma/client';
import { CreateVoterDto } from './dto/create-voter.dto';

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
    const [voters, total] = await Promise.all([
      this.prisma.voters.findMany({
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
      this.prisma.voters.count({
        where: {
          vc_id_relawan: user.id.toString(),
        },
      }),
    ]);

    // hasil query perlu diserialize agar tidak error
    const serializedVoters = serializeBigInt(voters);

    return {
      data: serializedVoters,
      meta: {
        total,
      },
    };
  }

  async createVoterByDpt(user: users, dto: CreateVoterDto) {
    const now = new Date();

    const checkVoter = await this.prisma.voters.findFirst({
      where: {
        nu_id_dpt: Number(dto.idDpt),
      },
    });

    if (checkVoter) {
      
    }

    const dpt = await this.prisma.mst_dpt.findUnique({
      where: {
        nu_id_dpt: Number(dto.idDpt),
      },
    });

    const voter = await this.prisma.voters.create({
      data: {
        nu_id_dpt: dpt.nu_id_dpt,
        vc_nik: dpt.vc_nik,
        vc_no_hp: dto.noHP,
        vc_vote: dto.vote,
        vc_id_relawan: user.id.toString(),
        vc_lat: dto.lat,
        vc_long: dto.long,
        vc_url: dto.image,
        created_at: now,
        updated_at: now,
      },
    });
    return serializeBigInt(voter);
  }
}
