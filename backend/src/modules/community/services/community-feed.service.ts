import { Injectable } from '@nestjs/common';
import { CommunityRepository } from '../community.repository';

@Injectable()
export class CommunityFeedService {
  constructor(private readonly repo: CommunityRepository) {}

  async getTrendingPosts() {
    return this.repo.getFeed(1, 20); // Basic feed logic
  }
}
