import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { serializeBigInt } from 'src/util/serialization.util';

@Injectable()
export class DptService {
    constructor(private prisma: PrismaService) { }
    async getDpts() {
        const dpts = await this.prisma.new_mst_desa.findFirst();
        console.log(dpts);

        const serializedDpts = serializeBigInt(dpts);

        return serializedDpts;
    }
}
