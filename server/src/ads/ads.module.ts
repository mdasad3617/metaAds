import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';
import { UsersModule } from '../users/users.module';
import { MetaModule } from '../meta/meta.module';
import { Campaign } from '../entities/campaign.entity';
import { AdSet } from '../entities/ad-set.entity';
import { Ad } from '../entities/ad.entity';
import { AdCopy } from '../entities/ad-copy.entity';
import { AdCreative } from '../entities/ad-creative.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, AdSet, Ad, AdCopy, AdCreative]),
    UsersModule, 
    MetaModule
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}