// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  metaAccessToken?: string;
  metaUserId?: string;
  metaAdAccountId?: string;
}

// Campaign Types
export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: CampaignStatus;
  budget?: number;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  metaCampaignId?: string;
  userId: string;
}

export enum CampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED'
}

export enum CampaignObjective {
  OUTCOME_AWARENESS = 'OUTCOME_AWARENESS',
  OUTCOME_TRAFFIC = 'OUTCOME_TRAFFIC',
  OUTCOME_ENGAGEMENT = 'OUTCOME_ENGAGEMENT',
  OUTCOME_LEADS = 'OUTCOME_LEADS',
  OUTCOME_APP_PROMOTION = 'OUTCOME_APP_PROMOTION',
  OUTCOME_SALES = 'OUTCOME_SALES'
}

// Ad Set Types
export interface AdSet {
  id: string;
  name: string;
  campaignId: string;
  targetingOptions?: any;
  budget?: number;
  bidStrategy?: string;
  status: AdSetStatus;
  createdAt: Date;
  updatedAt: Date;
  metaAdSetId?: string;
}

export enum AdSetStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED'
}

// Ad Types
export interface Ad {
  id: string;
  name: string;
  adSetId: string;
  adCopyId?: string;
  adCreativeId?: string;
  status: AdStatus;
  createdAt: Date;
  updatedAt: Date;
  metaAdId?: string;
}

export enum AdStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED'
}

// Ad Copy Types
export interface AdCopy {
  id: string;
  headline: string;
  primaryText: string;
  description?: string;
  callToAction?: string;
  prompt?: string;
  aiModel?: string;
  temperature?: number;
  userId: string;
  campaignId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Ad Creative Types
export interface AdCreative {
  id: string;
  type: CreativeType;
  imageUrl?: string;
  videoUrl?: string;
  prompt?: string;
  aiModel?: string;
  style?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CreativeType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  CAROUSEL = 'CAROUSEL'
}

// API Request/Response Types
export interface CreateCampaignRequest {
  name: string;
  objective: CampaignObjective;
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

export interface GenerateAdCopyRequest {
  productName: string;
  productDescription: string;
  targetAudience: string;
  adObjective: string;
  tone?: string;
  variations?: number;
}

export interface GenerateAdImageRequest {
  productName: string;
  productDescription: string;
  style?: string;
  aspectRatio?: string;
}

// Meta API Types
export interface MetaAdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
  amount_spent?: string;
  balance?: string;
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

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}