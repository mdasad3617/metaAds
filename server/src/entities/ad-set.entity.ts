import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Campaign } from './campaign.entity';
import { Ad } from './ad.entity';
import { AdSetStatus } from '../types/shared.types';

@Entity('ad_sets')
export class AdSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  targetingOptions?: any;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget?: number;

  @Column({ nullable: true })
  bidStrategy?: string;

  @Column({
    type: 'enum',
    enum: AdSetStatus,
    default: AdSetStatus.DRAFT
  })
  status: AdSetStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Meta ad set ID when published
  @Column({ nullable: true })
  metaAdSetId?: string;

  // Relations
  @Column()
  campaignId: string;

  @ManyToOne(() => Campaign, campaign => campaign.adSets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campaignId' })
  campaign: Campaign;

  @OneToMany(() => Ad, ad => ad.adSet)
  ads: Ad[];
}