import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class CommunityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: any) {
    return this.prisma.communityPost.create({ data });
  }

  async getFeed(page: number, limit: number) {
    return this.prisma.communityPost.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { author: true, tags: { include: { tag: true } } },
    });
  }
}
