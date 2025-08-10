import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AdsService, CreateCampaignRequest, CreateAdSetRequest, CreateAdRequest } from './ads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ads')
@UseGuards(JwtAuthGuard)
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post('campaigns')
  async createCampaign(@Request() req, @Body() body: CreateCampaignRequest) {
    return this.adsService.createCampaign(req.user.userId, body);
  }

  @Post('campaigns/:id/publish')
  async publishCampaign(@Request() req, @Param('id') campaignId: string) {
    return this.adsService.publishCampaignToMeta(req.user.userId, campaignId);
  }

  @Post('adsets')
  async createAdSet(@Request() req, @Body() body: CreateAdSetRequest) {
    return this.adsService.createAdSet(req.user.userId, body);
  }

  @Post('ads')
  async createAd(@Request() req, @Body() body: CreateAdRequest) {
    return this.adsService.createAd(req.user.userId, body);
  }

  @Get('campaigns')
  async getCampaigns(@Request() req) {
    return this.adsService.getCampaigns(req.user.userId);
  }

  @Get('campaigns/:id')
  async getCampaignById(@Request() req, @Param('id') campaignId: string) {
    return this.adsService.getCampaignById(req.user.userId, campaignId);
  }

  @Get('meta/adaccounts')
  async getMetaAdAccounts(@Request() req) {
    return this.adsService.getMetaAdAccounts(req.user.userId);
  }
}