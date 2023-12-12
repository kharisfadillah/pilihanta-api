import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';
import { mst_dpt, users } from '@prisma/client';
import { CreateVoterDto } from './dto/create-voter.dto';
import { ValidationError } from 'class-validator';

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
        include: {
          dpt: true,
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

  async createVoter(user: users, dto: CreateVoterDto) {
    const now = new Date();

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        let whereCondition = {};
        if (dto.idDpt) {
          whereCondition = {
            nu_id_dpt: Number(dto.idDpt),
          };
        } else {
          whereCondition = {
            vc_nik: dto.nik,
          };
        }
        const checkVoter = await prisma.voters.findFirst({
          where: whereCondition,
        });

        let dpt: mst_dpt;
        if (checkVoter) {
          if (
            user.vc_group.toLowerCase() == checkVoter.vc_group.toLowerCase()
          ) {
            throw new ConflictException([
              `Voter dengan NIK ${checkVoter.vc_nik} sudah terdaftar`,
            ]);
          }
        }

        if (dto.idDpt) {
          dpt = await prisma.mst_dpt.findUnique({
            where: {
              nu_id_dpt: Number(dto.idDpt),
            },
          });
        } else {
          dpt = await prisma.mst_dpt.create({
            data: {
              vc_nik: dto.nik,
              vc_nama: dto.nama,
              vc_alamat: dto.alamat,
              vc_id_provinsi: dto.idProvinsi,
              vc_id_kabupaten: dto.idKabupaten,
              vc_id_kecamatan: dto.idKecamatan,
              vc_id_desa: dto.idDesa,
              vc_rt: dto.rt,
              vc_no_hp: dto.noHP,
              vc_recruit_by: user.id.toString(),
              created_at: now,
              updated_at: now,
            },
          });
        }

        const voter = await prisma.voters.create({
          data: {
            nu_id_dpt: dpt.nu_id_dpt,
            vc_nik: dpt.vc_nik,
            vc_no_hp: dto.noHP,
            vc_vote: dto.vote,
            vc_id_relawan: user.id.toString(),
            vc_lat: dto.lat,
            vc_long: dto.long,
            vc_url: dto.image,
            vc_rt: dto.rt,
            vc_group: user.vc_group,
            created_by: user.id.toString(),
            created_at: now,
            updated_at: now,
          },
        });

        return serializeBigInt(voter);
      });

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      // Disconnect from Prisma after the transaction
      await this.prisma.$disconnect();
    }
  }
}
