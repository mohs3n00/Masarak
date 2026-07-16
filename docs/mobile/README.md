# Masarak Mobile Handoff Documentation

Welcome to the Masarak Mobile Handoff Documentation suite. This exhaustive set of documents serves as the single source of truth for the Flutter engineering team tasked with building the Masarak mobile application. It translates the existing Web (Next.js) and Backend (NestJS + Prisma) logic into actionable mobile requirements.

> **Note**: You do not need to inspect the web repository. Everything required to build the mobile app is detailed here.

## 📖 Recommended Reading Order

Please review the documentation in the following phases:

### Phase 1: High-Level Architecture & User Journeys
Understand what the product is and how users interact with it.
1. [01. Project Overview](./01_Project_Overview.md)
2. [02. User Flows](./02_User_Flows.md)
3. [03. Screen Inventory](./03_Screen_Inventory.md)
4. [04. Navigation Map (with Flowchart)](./04_Navigation_Map.md)

### Phase 2: Data & Backend Integration
Deep dive into the API structure, database relations, and authentication mechanics.
5. [05. API Reference](./05_API_Reference.md)
   - **Important**: We have generated a complete OpenAPI spec. Import `swagger.json` into Postman or Bruno.
6. [06. Data Models](./06_Data_Models.md)
7. [07. Authentication](./07_Authentication.md)

### Phase 3: Logic & Rules
Learn the strict business logic that the UI must respect and enforce.
8. [08. Business Rules](./08_Business_Rules.md)
9. [09. Validation Rules](./09_Validation_Rules.md)
10. [10. Error Catalog](./10_Error_Catalog.md)

### Phase 4: UI & Design
Guidelines for building a consistent, polished mobile experience.
11. [11. UI States](./11_UI_States.md)
12. [12. Assets & Media Handling](./12_Assets.md)
13. [13. Design System & Theming](./13_Design_System.md)
14. [14. Component Library](./14_Component_Library.md)

### Phase 5: Flutter Strategy & Implementation
Specific architectural recommendations for the Flutter codebase.
15. [15. Flutter Strategy & Mapping](./15_Flutter_Mapping.md)
16. [16. Flutter Architecture Recommendation](./16_Flutter_Architecture.md)
17. [17. State Management](./17_State_Management.md)
18. [18. Implementation Order](./18_Implementation_Order.md)
19. [19. Testing Checklist](./19_Testing_Checklist.md)

### Phase 6: Audits & Matrices
Strategic overviews of technical debt, priority lists, and DTO mappings.
20. [20. Codebase Audit: Technical Debt & Improvements](./20_Known_Issues_And_Improvements.md)
21. [21. Mobile-Specific Recommendations](./21_Mobile_Specific_Recommendations.md)
22. [22. Flutter DTO Mapping](./22_Flutter_DTO_Mapping.md)
23. [23. Mobile Feature Matrix](./23_Mobile_Feature_Matrix.md)

---

## 🛠 Required Tools for the Mobile Team
- **Flutter SDK**: `^3.19.0`
- **Recommended Editor**: VS Code or Android Studio.
- **API Testing**: Postman (Import `docs/mobile/swagger.json`).

*Generated automatically based on a deep analysis of the Masarak Web & Backend production repositories.*
