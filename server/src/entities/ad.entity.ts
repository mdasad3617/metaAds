import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { AdSet } from './ad-set.entity';
import { AdCopy } from './ad-copy.entity';
import { AdCreative } from './ad-creative.entity';
import { AdStatus } from '../types/shared.types';

@Entity('ads')
export class Ad {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: AdStatus,
    default: AdStatus.DRAFT
  })
  status: AdStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Meta ad ID when published
  @Column({ nullable: true })
  metaAdId?: string;

  // Relations
  @Column()
  adSetId: string;

  @ManyToOne(() => AdSet, adSet => adSet.ads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adSetId' })
  adSet: AdSet;

  @Column({ nullable: true })
  adCopyId?: string;

  @ManyToOne(() => AdCopy, { nullable: true })
  @JoinColumn({ name: 'adCopyId' })
  adCopy?: AdCopy;

  @Column({ nullable: true })
  adCreativeId?: string;

  @ManyToOne(() => AdCreative, { nullable: true })
  @JoinColumn({ name: 'adCreativeId' })
  adCreative?: AdCreative;
}