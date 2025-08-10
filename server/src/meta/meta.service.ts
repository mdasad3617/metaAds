import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import axios from 'axios';

export interface MetaAdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
  amount_spent: string;
  balance: string;
}

export interface MetaCampaignData {
  name: string;
  objective: string;
  status: string;
  special_ad_categories?: string[];
  buying_type?: string;
}

export interface MetaAdSetData {
  name: string;
  campaign_id: string;
  targeting: any;
  billing_event: string;
  optimization_goal: string;
  bid_amount?: number;
  daily_budget?: number;
  lifetime_budget?: number;
  status: string;
}

export interface MetaAdData {
  name: string;
  adset_id: string;
  creative: {
    name: string;
    object_story_spec: any;
  };
  status: string;
}

@Injectable()
export class MetaService {
  private readonly metaApiUrl: string;

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const apiVersion = this.configService.get('META_API_VERSION', 'v19.0');
    this.metaApiUrl = `https://graph.facebook.com/${apiVersion}`;
  }

  private async getMetaHeaders(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user?.metaAccessToken) {
      throw new UnauthorizedException('Meta access token not found. Please connect your Facebook account.');
    }

    return {
      'Authorization': `Bearer ${user.metaAccessToken}`,
      'Content-Type': 'application/json',
    };
  }

  async exchangeCodeForToken(code: string, redirectUri: string) {
    const appId = this.configService.get('META_APP_ID');
    const appSecret = this.configService.get('META_APP_SECRET');

    if (!appId || !appSecret) {
      throw new BadRequestException('Meta app credentials not configured');
    }

    try {
      const response = await axios.get(`${this.metaApiUrl}/oauth/access_token`, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code: code,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new BadRequestException('Failed to exchange authorization code for access token');
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      const response = await axios.get(`${this.metaApiUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          fields: 'id,name,email',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error getting user info:', error.response?.data || error.message);
      throw new BadRequestException('Failed to get user information from Meta');
    }
  }

  async getAdAccounts(userId: string): Promise<MetaAdAccount[]> {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.get(`${this.metaApiUrl}/me/adaccounts`, {
        headers,
        params: {
          fields: 'id,name,account_status,currency,timezone_name,amount_spent,balance',
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Error fetching ad accounts:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch Meta ad accounts');
    }
  }

  async createCampaign(userId: string, adAccountId: string, campaignData: MetaCampaignData) {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.post(
        `${this.metaApiUrl}/act_${adAccountId}/campaigns`,
        {
          name: campaignData.name,
          objective: campaignData.objective,
          status: campaignData.status || 'PAUSED',
          special_ad_categories: campaignData.special_ad_categories || [],
          buying_type: campaignData.buying_type || 'AUCTION',
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating campaign:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to create campaign: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async createAdSet(userId: string, adAccountId: string, adSetData: MetaAdSetData) {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.post(
        `${this.metaApiUrl}/act_${adAccountId}/adsets`,
        {
          name: adSetData.name,
          campaign_id: adSetData.campaign_id,
          targeting: adSetData.targeting,
          billing_event: adSetData.billing_event || 'IMPRESSIONS',
          optimization_goal: adSetData.optimization_goal || 'REACH',
          bid_amount: adSetData.bid_amount,
          daily_budget: adSetData.daily_budget,
          lifetime_budget: adSetData.lifetime_budget,
          status: adSetData.status || 'PAUSED',
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating ad set:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to create ad set: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async createAdCreative(userId: string, adAccountId: string, creativeData: any) {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.post(
        `${this.metaApiUrl}/act_${adAccountId}/adcreatives`,
        creativeData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating ad creative:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to create ad creative: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async createAd(userId: string, adAccountId: string, adData: MetaAdData) {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.post(
        `${this.metaApiUrl}/act_${adAccountId}/ads`,
        {
          name: adData.name,
          adset_id: adData.adset_id,
          creative: adData.creative,
          status: adData.status || 'PAUSED',
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating ad:', error.response?.data || error.message);
      throw new BadRequestException(`Failed to create ad: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async getCampaignInsights(userId: string, campaignId: string, dateRange?: { since: string; until: string }) {
    const headers = await this.getMetaHeaders(userId);

    try {
      const params: any = {
        fields: 'impressions,clicks,spend,ctr,cpm,cpp,reach,frequency,actions,cost_per_action_type',
      };

      if (dateRange) {
        params.time_range = JSON.stringify(dateRange);
      }

      const response = await axios.get(
        `${this.metaApiUrl}/${campaignId}/insights`,
        { headers, params }
      );

      return response.data.data[0] || null;
    } catch (error) {
      console.error('Error fetching campaign insights:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch campaign insights');
    }
  }

  async updateCampaignStatus(userId: string, campaignId: string, status: 'ACTIVE' | 'PAUSED') {
    const headers = await this.getMetaHeaders(userId);

    try {
      const response = await axios.post(
        `${this.metaApiUrl}/${campaignId}`,
        { status },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating campaign status:', error.response?.data || error.message);
      throw new BadRequestException('Failed to update campaign status');
    }
  }

  async validateAccessToken(accessToken: string) {
    try {
      const response = await axios.get(`${this.metaApiUrl}/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        params: {
          fields: 'id,name',
        },
      });

      return { valid: true, data: response.data };
    } catch (error) {
      return { valid: false, error: error.response?.data || error.message };
    }
  }

  generateAuthUrl(redirectUri: string, state?: string) {
    const appId = this.configService.get('META_APP_ID');
    if (!appId) {
      throw new BadRequestException('Meta app ID not configured');
    }

    const baseUrl = 'https://www.facebook.com/v19.0/dialog/oauth';
    const params = new URLSearchParams({
      client_id: appId,
      redirect_uri: redirectUri,
      scope: 'ads_management,ads_read,business_management',
      response_type: 'code',
      state: state || 'random_state_string',
    });

    return `${baseUrl}?${params.toString()}`;
  }
}