import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Campaign } from './campaign.entity';
import { AdCopy } from './ad-copy.entity';
import { AdCreative } from './ad-creative.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  name?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Meta/Facebook integration
  @Column({ nullable: true })
  metaAccessToken?: string;

  @Column({ nullable: true })
  metaUserId?: string;

  @Column({ nullable: true })
  metaAdAccountId?: string;

  // Relations
  @OneToMany(() => Campaign, campaign => campaign.user)
  campaigns: Campaign[];

  @OneToMany(() => AdCopy, adCopy => adCopy.user)
  adCopies: AdCopy[];

  @OneToMany(() => AdCreative, adCreative => adCreative.user)
  adCreatives: AdCreative[];
}