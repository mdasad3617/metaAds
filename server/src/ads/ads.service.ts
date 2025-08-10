import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MetaService } from '../meta/meta.service';
import { Campaign } from '../entities/campaign.entity';
import { AdSet } from '../entities/ad-set.entity';
import { Ad } from '../entities/ad.entity';
import { AdCopy } from '../entities/ad-copy.entity';
import { AdCreative } from '../entities/ad-creative.entity';

export interface CreateCampaignRequest {
  name: string;
  objective: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateAdSetRequest {
  campaignId: string;
  name: string;
  targetingOptions?: any;
  budget?: number;
  bidStrategy?: string;
}

export interface CreateAdRequest {
  adSetId: string;
  name: string;
  adCopyId?: string;
  adCreativeId?: string;
}

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(AdSet)
    private adSetRepository: Repository<AdSet>,
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
    @InjectRepository(AdCopy)
    private adCopyRepository: Repository<AdCopy>,
    @InjectRepository(AdCreative)
    private adCreativeRepository: Repository<AdCreative>,
    private usersService: UsersService,
    private metaService: MetaService,
  ) {}

  async createCampaign(userId: string, request: CreateCampaignRequest) {
    const { name, objective, budget, startDate, endDate } = request;

    const campaign = this.campaignRepository.create({
      name,
      objective: objective as any,
      budget,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      userId,
    });

    return this.campaignRepository.save(campaign);
  }

  async createAdSet(userId: string, request: CreateAdSetRequest) {
    const { campaignId, name, targetingOptions, budget, bidStrategy } = request;

    // Verify campaign belongs to user
    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId, userId },
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    const adSet = this.adSetRepository.create({
      name,
      targetingOptions,
      budget,
      bidStrategy,
      campaignId,
    });

    return this.adSetRepository.save(adSet);
  }

  async createAd(userId: string, request: CreateAdRequest) {
    const { adSetId, name, adCopyId, adCreativeId } = request;

    // Verify ad set belongs to user's campaign
    const adSet = await this.adSetRepository.findOne({
      where: { id: adSetId },
      relations: ['campaign'],
    });

    if (!adSet || adSet.campaign.userId !== userId) {
      throw new BadRequestException('Ad set not found');
    }

    const ad = this.adRepository.create({
      name,
      adSetId,
      adCopyId,
      adCreativeId,
    });

    return this.adRepository.save(ad);
  }

  async getCampaigns(userId: string) {
    return this.campaignRepository.find({
      where: { userId },
      relations: ['adSets', 'adSets.ads', 'adSets.ads.adCopy', 'adSets.ads.adCreative'],
      order: { createdAt: 'DESC' },
    });
  }

  async getCampaignById(userId: string, campaignId: string) {
    return this.campaignRepository.findOne({
      where: { id: campaignId, userId },
      relations: ['adSets', 'adSets.ads', 'adSets.ads.adCopy', 'adSets.ads.adCreative'],
    });
  }

  async publishCampaignToMeta(userId: string, campaignId: string) {
    const user = await this.usersService.findById(userId);
    if (!user?.metaAccessToken || !user?.metaAdAccountId) {
      throw new BadRequestException('Meta integration not configured. Please connect your Facebook account and select an ad account.');
    }

    const campaign = await this.campaignRepository.findOne({
      where: { id: campaignId, userId },
      relations: ['adSets', 'adSets.ads', 'adSets.ads.adCopy', 'adSets.ads.adCreative'],
    });

    if (!campaign) {
      throw new BadRequestException('Campaign not found');
    }

    if (campaign.metaCampaignId) {
      throw new BadRequestException('Campaign is already published to Meta');
    }

    try {
      // Create campaign on Meta
      const metaCampaignResponse = await this.metaService.createCampaign(
        userId,
        user.metaAdAccountId,
        {
          name: campaign.name,
          objective: campaign.objective,
          status: 'PAUSED', // Start paused for safety
        }
      );

      // Update local campaign with Meta ID
      await this.campaignRepository.update(campaignId, { 
        metaCampaignId: metaCampaignResponse.id 
      });

      return {
        ...campaign,
        metaCampaignId: metaCampaignResponse.id,
        message: 'Campaign published to Meta successfully',
      };
    } catch (error) {
      console.error('Error publishing campaign to Meta:', error);
      throw new BadRequestException(`Failed to publish campaign to Meta: ${error.message}`);
    }
  }

  async getMetaAdAccounts(userId: string) {
    return this.metaService.getAdAccounts(userId);
  }
}