import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Ad } from './ad.entity';
import { CreativeType } from '../types/shared.types';

@Entity('ad_creatives')
export class AdCreative {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: CreativeType,
    default: CreativeType.IMAGE
  })
  type: CreativeType;

  @Column('text', { nullable: true })
  imageUrl?: string;

  @Column('text', { nullable: true })
  videoUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // AI generation metadata
  @Column('text', { nullable: true })
  prompt?: string;

  @Column({ nullable: true })
  aiModel?: string;

  @Column({ nullable: true })
  style?: string;

  // Relations
  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.adCreatives, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Ad, ad => ad.adCreative)
  ads: Ad[];
}