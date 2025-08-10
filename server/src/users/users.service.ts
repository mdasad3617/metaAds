import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface CreateUserData {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserData) {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        metaAccessToken: true,
        metaUserId: true,
        metaAdAccountId: true,
      },
    });
  }

  async updateMetaIntegration(
    userId: string,
    data: {
      metaAccessToken?: string;
      metaUserId?: string;
      metaAdAccountId?: string;
    },
  ) {
    await this.userRepository.update(userId, data);
    return this.userRepository.findOne({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        metaUserId: true,
        metaAdAccountId: true,
      },
    });
  }
}