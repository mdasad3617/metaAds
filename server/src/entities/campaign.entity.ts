import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { AdSet } from './ad-set.entity';
import { AdCopy } from './ad-copy.entity';
import { CampaignStatus, CampaignObjective } from '../types/shared.types';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CampaignObjective,
    default: CampaignObjective.TRAFFIC
  })
  objective: CampaignObjective;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT
  })
  status: CampaignStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  budget?: number;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Meta campaign ID when published
  @Column({ nullable: true })
  metaCampaignId?: string;

  // Relations
  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.campaigns, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AdSet, adSet => adSet.campaign)
  adSets: AdSet[];

  @OneToMany(() => AdCopy, adCopy => adCopy.campaign)
  adCopies: AdCopy[];
}