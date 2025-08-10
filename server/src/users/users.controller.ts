import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsOptional, IsString } from 'class-validator';

class UpdateMetaIntegrationDto {
  @IsOptional()
  @IsString()
  metaAccessToken?: string;

  @IsOptional()
  @IsString()
  metaUserId?: string;

  @IsOptional()
  @IsString()
  metaAdAccountId?: string;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Put('meta-integration')
  async updateMetaIntegration(
    @Request() req,
    @Body() updateDto: UpdateMetaIntegrationDto,
  ) {
    return this.usersService.updateMetaIntegration(req.user.userId, updateDto);
  }
}