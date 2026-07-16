# 12. Assets & Media Handling

This document specifies how the mobile application should handle static assets, remote media, and local caching.

## 1. Remote Image Handling
All user avatars, course thumbnails, and community post images are hosted remotely (e.g., S3, Cloudinary).
- **Tool**: Use `cached_network_image` in Flutter.
- **Rules**:
  - Always provide a placeholder widget (e.g., a subtle gray container).
  - Provide an `errorWidget` (e.g., a fallback generic icon) in case the URL returns a 404.
  - Avatars must be clipped using `CircleAvatar` or `ClipOval`.

## 2. Video Playback
Courses contain video lessons (hosted on BunnyCDN, Vimeo, or YouTube).
- **Tool**: `video_player` combined with `chewie` or a specialized package like `youtube_player_flutter`.
- **Rules**:
  - The player must support full-screen landscape rotation.
  - Implement playback speed controls (1x, 1.25x, 1.5x, 2x).
  - Prevent screen recording (DRM) using `flutter_windowmanager` (Android) and `screen_protector` (iOS).

## 3. Documents (PDF)
Lessons can contain attached PDFs.
- **Tool**: `flutter_pdfview` or `syncfusion_flutter_pdfviewer`.
- **Rules**:
  - Download the PDF locally to the device's temporary directory before opening to ensure smooth scrolling.
  - Show a downloading progress indicator.

## 4. Local Assets (Icons & Illustrations)
- Place all app-specific SVG icons and illustrations in `assets/images/` and `assets/icons/`.
- **Tool**: `flutter_svg` for crisp vector graphics across all pixel densities.
- Do not use raster images (PNG/JPG) for UI elements to reduce app size.

## 5. File Uploads
When a user uploads an avatar or a teacher creates a course:
- **Tool**: `image_picker` and `file_picker`.
- **Rules**:
  - Images must be compressed client-side before uploading (use `flutter_image_compress`).
  - API expects `multipart/form-data`.
  - Handle camera permissions gracefully.

## Related Documents
- [09. Validation Rules](./09_Validation_Rules.md) (File size and format constraints)
- [05. API Reference](./05_API_Reference.md) (Upload endpoints)
