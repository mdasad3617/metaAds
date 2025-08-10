import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AdCopy } from '../entities/ad-copy.entity';
import { AdCreative } from '../entities/ad-creative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdCopy, AdCreative])],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}