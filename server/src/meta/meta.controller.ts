import { Controller, Get, Post, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { MetaService } from './meta.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsOptional } from 'class-validator';

class ConnectMetaDto {
    @IsString()
    code: string;

    @IsString()
    redirectUri: string;
}

class UpdateAdAccountDto {
    @IsString()
    adAccountId: string;
}

@Controller('meta')
@UseGuards(JwtAuthGuard)
export class MetaController {
    constructor(
        private readonly metaService: MetaService,
        private readonly usersService: UsersService,
    ) { }

    @Get('auth-url')
    getAuthUrl(@Query('redirect_uri') redirectUri: string, @Query('state') state?: string) {
        return {
            authUrl: this.metaService.generateAuthUrl(redirectUri, state),
        };
    }

    @Post('connect')
    async connectMeta(@Request() req, @Body() connectDto: ConnectMetaDto) {
        const { code, redirectUri } = connectDto;

        // Exchange code for access token
        const tokenData = await this.metaService.exchangeCodeForToken(code, redirectUri);

        // Get user info from Meta
        const userInfo = await this.metaService.getUserInfo(tokenData.access_token);

        // Update user with Meta credentials
        const updatedUser = await this.usersService.updateMetaIntegration(req.user.userId, {
            metaAccessToken: tokenData.access_token,
            metaUserId: userInfo.id,
        });

        return {
            success: true,
            user: updatedUser,
            metaUser: userInfo,
        };
    }

    @Get('ad-accounts')
    async getAdAccounts(@Request() req) {
        return this.metaService.getAdAccounts(req.user.userId);
    }

    @Post('ad-account')
    async setAdAccount(@Request() req, @Body() updateDto: UpdateAdAccountDto) {
        const updatedUser = await this.usersService.updateMetaIntegration(req.user.userId, {
            metaAdAccountId: updateDto.adAccountId,
        });

        return {
            success: true,
            user: updatedUser,
        };
    }

    @Get('connection-status')
    async getConnectionStatus(@Request() req) {
        const user = await this.usersService.findById(req.user.userId);

        if (!user?.metaAccessToken) {
            return {
                connected: false,
                message: 'Meta account not connected',
            };
        }

        const validation = await this.metaService.validateAccessToken(user.metaAccessToken);

        return {
            connected: validation.valid,
            user: validation.valid ? validation.data : null,
            adAccountId: user.metaAdAccountId,
            error: validation.valid ? null : validation.error,
        };
    }

    @Get('campaigns/:id/insights')
    async getCampaignInsights(
        @Request() req,
        @Param('id') campaignId: string,
        @Query('since') since?: string,
        @Query('until') until?: string,
    ) {
        const dateRange = since && until ? { since, until } : undefined;
        return this.metaService.getCampaignInsights(req.user.userId, campaignId, dateRange);
    }

    @Post('campaigns/:id/status')
    async updateCampaignStatus(
        @Request() req,
        @Param('id') campaignId: string,
        @Body('status') status: 'ACTIVE' | 'PAUSED',
    ) {
        return this.metaService.updateCampaignStatus(req.user.userId, campaignId, status);
    }

    @Post('disconnect')
    async disconnectMeta(@Request() req) {
        const updatedUser = await this.usersService.updateMetaIntegration(req.user.userId, {
            metaAccessToken: null,
            metaUserId: null,
            metaAdAccountId: null,
        });

        return {
            success: true,
            message: 'Meta account disconnected successfully',
            user: updatedUser,
        };
    }
}