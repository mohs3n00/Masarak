import { PricingPlan } from '../types/models';

export const pricing: PricingPlan[] = [
  {
    "id": "plan_1",
    "name": "الأساسية",
    "price": 150,
    "period": "MONTHLY",
    "features": [
      "الوصول إلى 5 كورسات شهرياً",
      "اختبارات أساسية",
      "دعم فني عبر البريد"
    ],
    "isPopular": false
  },
  {
    "id": "plan_2",
    "name": "المميزة",
    "price": 350,
    "period": "MONTHLY",
    "features": [
      "وصول غير محدود لجميع الكورسات",
      "اختبارات ومراجعات شاملة",
      "دعم فني أولوية",
      "تحميل المذكرات PDF"
    ],
    "isPopular": true
  },
  {
    "id": "plan_3",
    "name": "السنوية",
    "price": 3500,
    "period": "YEARLY",
    "features": [
      "جميع ميزات الباقة المميزة",
      "خصم 20% على الاشتراك",
      "حضور حصص المراجعة النهائية مجاناً"
    ],
    "isPopular": false
  }
];