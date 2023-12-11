import { Module } from '@nestjs/common';
import { VoterController } from './voter.controller';
import { VoterService } from './voter.service';

@Module({
  controllers: [VoterController],
  providers: [VoterService],
})
export class VoterModule {}
