# 21. Mobile-Specific Recommendations

Building for iOS and Android introduces paradigms that do not exist on the web. The Flutter team must implement these mobile-specific features to ensure a premium user experience.

## 1. Push Notifications (FCM)
- **Web**: Currently uses in-app polling or simple web notifications.
- **Mobile Requirement**: Integrate Firebase Cloud Messaging (FCM).
- **Implementation**: 
  - Send the device `fcmToken` to the backend upon login (`POST /auth/device-token`).
  - Handle foreground notifications using `flutter_local_notifications`.
  - Handle background/terminated state deep-linking (e.g., tapping a notification about a graded assignment opens the exact assignment screen).

## 2. Offline Resilience
- **Mobile Requirement**: The app should not immediately break or show infinite loaders if the user is on a subway or has a spotty connection.
- **Implementation**:
  - Cache the Home Dashboard and active Course syllabus using `Hive`.
  - Implement a global `ConnectivityPlus` listener that displays a subtle "No Connection" banner without blocking UI navigation for cached screens.

## 3. Biometric Authentication
- **Mobile Requirement**: For faster logins, especially for teachers viewing financial data.
- **Implementation**:
  - Use `local_auth`. 
  - After the first successful login, prompt: "Enable Face ID / Fingerprint for future logins?"
  - Securely store the password or token in the hardware keychain.

## 4. App Store Guidelines Compliance
- **Apple App Store (iOS)**:
  - Apple strictly requires "Sign in with Apple" if other social logins are present. (Masarak currently uses Email/Phone, so this is optional but recommended).
  - Account Deletion: You MUST provide a way for the user to delete their account directly within the app (already supported by `ActivityAction.ACCOUNT_DELETION` in DB).
  - Digital Purchases: If selling courses as digital goods within the app, Apple requires using In-App Purchases (IAP) and takes a 30% cut. To avoid this, consider making the iOS app a "Reader App" (users purchase on the web and consume on mobile) OR negotiate/integrate a Webview checkout that strictly complies with local regulations, though Apple is known to reject Webview gateways for digital goods.

## 5. Security & Anti-Piracy
- **Implementation**:
  - Obfuscate Dart code during compilation (`--obfuscate --split-debug-info`).
  - Use `screen_protector` to block screenshots and screen recording on Course Video screens.
  - Implement root/jailbreak detection (`root_jailbreak_sniffer`) and prevent app execution on compromised devices.
