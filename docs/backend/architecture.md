# Backend Architecture Guidelines

## Shared Infrastructure Abstraction

All third-party services in Masarak MUST be wrapped inside a local module abstraction under `src/shared/`.

### Provider Interfaces
We never inject an external library SDK (like `twilio`, `nodemailer`, or `cloudinary`) directly into a business module.
Instead, we define an interface (e.g., `SmsProvider`) and implement it within specific service classes.

### Factory Pattern
The `<module>.module.ts` files use NestJS dynamic providers and factories to resolve the correct implementation based on environment variables.

Example:
```typescript
{
  provide: 'SMS_PROVIDER',
  useFactory: (configService: ConfigService) => {
    // Dynamic resolution logic
    return new TwilioProvider(configService);
  },
  inject: [ConfigService],
}
```

### The Service Facade
The local `<module>.service.ts` is the single point of entry for the entire application. Business logic (like `AuthModule`) should only import and inject `SmsService` or `MailService`, keeping the underlying provider completely hidden.

This ensures:
1. **Easy Swapping**: Switching from Twilio to Unifonic requires zero changes to the `AuthModule`.
2. **Simplified Testing**: We can easily inject a mock provider instead of hitting live APIs.
3. **Clean Code**: SOLID principles are maintained.
