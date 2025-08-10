import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Campaign } from './campaign.entity';
import { Ad } from './ad.entity';

@Entity('ad_copies')
export class AdCopy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  headline: string;

  @Column('text')
  primaryText: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  callToAction?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // AI generation metadata
  @Column('text', { nullable: true })
  prompt?: string;

  @Column({ nullable: true })
  aiModel?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  temperature?: number;

  // Relations
  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.adCopies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  campaignId?: string;

  @ManyToOne(() => Campaign, campaign => campaign.adCopies, { nullable: true })
  @JoinColumn({ name: 'campaignId' })
  campaign?: Campaign;

  @OneToMany(() => Ad, ad => ad.adCopy)
  ads: Ad[];
}