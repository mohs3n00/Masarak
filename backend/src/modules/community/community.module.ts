import { Module } from '@nestjs/common';
import { CommunityRepository } from './community.repository';
import { CommunityFeedService } from './services/community-feed.service';

@Module({
  providers: [CommunityRepository, CommunityFeedService],
  exports: [CommunityRepository, CommunityFeedService],
})
export class CommunityModule {}
