import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------
  // Platform Settings
  // ---------------------------------------------------------
  async getPlatformSettings() {
    return this.prisma.platformSetting.findMany();
  }

  async updatePlatformSetting(
    key: string,
    value: string,
    description?: string,
  ) {
    return this.prisma.platformSetting.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  // ---------------------------------------------------------
  // Homepage Config
  // ---------------------------------------------------------
  async getHomepageConfig() {
    return this.prisma.homepageConfig.findMany();
  }

  async updateHomepageSection(
    section: string,
    data: {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      buttonText?: string;
      buttonLink?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.homepageConfig.upsert({
      where: { section },
      update: data,
      create: { section, ...data },
    });
  }

  // ---------------------------------------------------------
  // Footer Config
  // ---------------------------------------------------------
  async getFooterConfig() {
    return this.prisma.footerConfig.findMany();
  }

  async updateFooterConfig(
    platform: string,
    data: {
      value: string;
      icon?: string;
      isActive?: boolean;
    },
  ) {
    return this.prisma.footerConfig.upsert({
      where: { platform },
      update: data,
      create: { platform, ...data },
    });
  }
}
