# 23. Mobile Feature Matrix

This matrix provides the current implementation status across the Masarak stack, allowing project managers and the Flutter team to prioritize effectively.

| Feature Area | Specific Feature | Backend Status | Web Frontend Status | Mobile Priority | Notes |
|---|---|---|---|---|---|
| **Auth** | Registration & Login | ✅ Ready | ✅ Implemented | **High** | Requires OTP Flow |
| **Auth** | Password Reset | ✅ Ready | ✅ Implemented | **High** | |
| **Auth** | Biometric Login | ❌ N/A | ❌ N/A | **Medium** | Mobile specific feature |
| **Taxonomy** | Browse Stages & Levels | ✅ Ready | ✅ Implemented | **High** | Core discovery mechanism |
| **Courses** | Course Search & Filter | ✅ Ready | ✅ Implemented | **High** | |
| **Courses** | Public Course Details | ✅ Ready | ✅ Implemented | **High** | Needed for unauthenticated users |
| **Courses** | Teacher Course Creation | ✅ Ready | ✅ Implemented | **Low** | Teachers typically use desktop |
| **Player** | Video Playback | ✅ Ready | ✅ Implemented | **High** | Core requirement |
| **Player** | PDF Viewer | ✅ Ready | ✅ Implemented | **High** | |
| **Player** | Progress Tracking | ✅ Ready | ✅ Implemented | **High** | Send heartbeat every 10s |
| **Player** | Offline Downloads | ❌ No API yet | ❌ N/A | **Low** | Requires API update to grant DRM keys |
| **Exams** | Active Exam Timer | ✅ Ready | ✅ Implemented | **High** | Must handle app backgrounding |
| **Exams** | Auto-grading | ✅ Ready | ✅ Implemented | **High** | Backend handles calculation |
| **E-Commerce**| Cart & Coupons | ✅ Ready | ✅ Implemented | **High** | |
| **E-Commerce**| Paymob/Tap Checkout | ✅ Ready | ✅ Implemented | **High** | Apple might require IAP or reject webview |
| **Community** | Social Feed | ✅ Ready | ✅ Implemented | **Medium** | Great for retention |
| **Community** | Post Creation | ✅ Ready | ✅ Implemented | **Medium** | |
| **Profile** | Edit Avatar & Bio | ✅ Ready | ✅ Implemented | **Medium** | |
| **Settings** | Push Notifications | ✅ Ready (FCM) | ⚠️ Partial (Web) | **High** | Deep links required on tap |
| **Support** | AI Chat Assistant | ✅ Ready | ✅ Implemented | **Medium** | RAG Assistant for platform queries |
