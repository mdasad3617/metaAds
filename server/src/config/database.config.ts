import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Campaign } from '../entities/campaign.entity';
import { AdSet } from '../entities/ad-set.entity';
import { Ad } from '../entities/ad.entity';
import { AdCopy } from '../entities/ad-copy.entity';
import { AdCreative } from '../entities/ad-creative.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mdasad',
  database: process.env.DB_DATABASE || 'metaAds',
  entities: [User, Campaign, AdSet, Ad, AdCopy, AdCreative],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
});

export const databaseConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'Mdasad',
  database: process.env.DB_DATABASE || 'metaAds',
  entities: [User, Campaign, AdSet, Ad, AdCopy, AdCreative],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};