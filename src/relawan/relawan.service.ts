import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';
import { users } from '@prisma/client';
import { CreateRelawanDto } from './dto/create-relawan.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RelawanService {
  constructor(private prisma: PrismaService) {}
  async getRelawans(user: users, query: string, cursor: string) {
    const pageSize = 20;

    // Buat objek untuk menyimpan kondisi query
    const whereCondition: any = {
      AND: [
        {
          created_by: user.id.toString(),
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
    console.log('relawan-dto', dto);
    const now = new Date();

    const checkRelawan = await this.prisma.relawans.findFirst({
      where: {
        vc_nik: dto.nik,
      },
    });

    if (checkRelawan) {
      throw new ConflictException(
        `Relawan dengan nik ${dto.nik} sudah terdaftar`,
      );
    }

    const checkUser = await this.prisma.users.findFirst({
      where: {
        username: dto.username,
      },
    });

    if (checkUser) {
      throw new ForbiddenException(`Username sudah dipakai`);
    }

    const relawan = await this.prisma.relawans.create({
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
        vc_no_rek: dto.noRekening,
        vc_bank: dto.bank,
        vc_atas_nama: dto.atasNama,
        vc_jenis_relawan: dto.tingkatRelawan,
        created_by: user.id.toString(),
        created_at: now,
        updated_at: now,
      },
    });

    let data: any;
    switch (dto.tingkatRelawan) {
      case 'korkab': {
        const kab = await this.prisma.mst_kab.findFirst({
          where: {
            vc_id_kabupaten: dto.penempatan,
          },
        });
        await this.prisma.relawan_assign.create({
          data: {
            vc_id_rel: relawan.nu_id.toString(),
            vc_id_provinsi: kab.vc_id_provinsi.toString(),
            vc_id_kabupaten: dto.penempatan,
            nu_target: Number(dto.target),
            created_by: user.id.toString(),
            created_at: now,
            updated_at: now,
          },
        });
        break;
      }
      case 'korcam': {
        const kec = await this.prisma.mst_kec.findFirst({
          where: {
            vc_id_kecamatan: dto.penempatan,
          },
        });
        const kab = await this.prisma.mst_kab.findFirst({
          where: {
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
          },
        });
        await this.prisma.relawan_assign.create({
          data: {
            vc_id_rel: relawan.nu_id.toString(),
            vc_id_provinsi: kab.vc_id_provinsi.toString(),
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
            vc_id_kecamatan: dto.penempatan,
            nu_target: Number(dto.target),
            created_by: user.id.toString(),
            created_at: now,
            updated_at: now,
          },
        });
        break;
      }
      case 'kordes': {
        const desa = await this.prisma.mst_desa.findFirst({
          where: {
            vc_id_desa: dto.penempatan,
          },
        });
        const kec = await this.prisma.mst_kec.findFirst({
          where: {
            vc_id_kecamatan: desa.vc_id_kecamatan.toString(),
          },
        });
        const kab = await this.prisma.mst_kab.findFirst({
          where: {
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
          },
        });
        await this.prisma.relawan_assign.create({
          data: {
            vc_id_rel: relawan.nu_id.toString(),
            vc_id_provinsi: kab.vc_id_provinsi.toString(),
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
            vc_id_kecamatan: desa.vc_id_kecamatan.toString(),
            vc_id_desa: dto.penempatan,
            nu_target: Number(dto.target),
            created_by: user.id.toString(),
            created_at: now,
            updated_at: now,
          },
        });
        break;
      }
      case 'dtdc': {
        const desa = await this.prisma.mst_desa.findFirst({
          where: {
            vc_id_desa: dto.penempatan,
          },
        });
        const kec = await this.prisma.mst_kec.findFirst({
          where: {
            vc_id_kecamatan: desa.vc_id_kecamatan.toString(),
          },
        });
        const kab = await this.prisma.mst_kab.findFirst({
          where: {
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
          },
        });
        await this.prisma.relawan_assign.create({
          data: {
            vc_id_rel: relawan.nu_id.toString(),
            vc_id_provinsi: kab.vc_id_provinsi.toString(),
            vc_id_kabupaten: kec.vc_id_kabupaten.toString(),
            vc_id_kecamatan: desa.vc_id_kecamatan.toString(),
            vc_id_desa: dto.penempatan,
            nu_target: Number(dto.target),
            created_by: user.id.toString(),
            created_at: now,
            updated_at: now,
          },
        });
        break;
      }
    }

    await this.prisma.users.create({
      data: {
        username: dto.username,
        name: dto.nama,
        role: 'relawan',
        password: bcrypt.hashSync('123456', 10),
        created_at: now,
        updated_at: now,
        vc_group: user.vc_group,
        vc_id_rel: relawan.nu_id.toString(),
        created_by: user.id.toString(),
        vc_provinsi: Number(dto.idProvinsi),
      },
    });

    return relawan;
  }

  async getJenisRelawan(user: users) {
    console.log(user);
    const relawan = await this.prisma.relawans.findUnique({
      where: {
        nu_id: Number(user.vc_id_rel),
      },
    });

    if (!relawan) {
      throw new ForbiddenException('Pengguna tidak terdaftar sebagai relawan');
    }

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

  async checkUsername(username: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new ConflictException('Nama pengguna tidak tersedia');
    } else {
      return {
        message: 'ok',
      };
    }
  }

  async sarankanUsername(name: string) {
    let randomNum = Math.floor(Math.random() * 1000);
    let username = `${name.replace(/\s/g, '').toLowerCase()}`;
    let user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      username = `${name.replace(/\s/g, '').toLowerCase()}${randomNum}`;
    }
    user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      randomNum = Math.floor(Math.random() * 1000);
      username = `${name.replace(/\s/g, '').toLowerCase()}${randomNum}`;
    }
    user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      randomNum = Math.floor(Math.random() * 1000);
      username = `${name.replace(/\s/g, '').toLowerCase()}${randomNum}`;
    }
    user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      randomNum = Math.floor(Math.random() * 1000);
      username = `${name.replace(/\s/g, '').toLowerCase()}${randomNum}`;
    }
    user = await this.prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (user) {
      randomNum = Math.floor(Math.random() * 1000);
      username = `${name.replace(/\s/g, '').toLowerCase()}${randomNum}`;
    }
    return username;
  }
}
