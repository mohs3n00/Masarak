import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // ---------------------------------------------------------
  // Platform Settings
  // ---------------------------------------------------------
  @Get('platform')
  getPlatformSettings() {
    return this.settingsService.getPlatformSettings();
  }

  @Put('platform/:key')
  updatePlatformSetting(
    @Param('key') key: string,
    @Body() body: { value: string; description?: string },
  ) {
    return this.settingsService.updatePlatformSetting(
      key,
      body.value,
      body.description,
    );
  }

  // ---------------------------------------------------------
  // Homepage Config
  // ---------------------------------------------------------
  @Get('homepage')
  getHomepageConfig() {
    return this.settingsService.getHomepageConfig();
  }

  @Put('homepage/:section')
  updateHomepageSection(
    @Param('section') section: string,
    @Body()
    body: {
      title?: string;
      subtitle?: string;
      imageUrl?: string;
      buttonText?: string;
      buttonLink?: string;
      isActive?: boolean;
    },
  ) {
    return this.settingsService.updateHomepageSection(section, body);
  }

  // ---------------------------------------------------------
  // Footer Config
  // ---------------------------------------------------------
  @Get('footer')
  getFooterConfig() {
    return this.settingsService.getFooterConfig();
  }

  @Put('footer/:platform')
  updateFooterConfig(
    @Param('platform') platform: string,
    @Body()
    body: {
      value: string;
      icon?: string;
      isActive?: boolean;
    },
  ) {
    return this.settingsService.updateFooterConfig(platform, body);
  }
}
