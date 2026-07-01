import { CommunityPost } from '../types/models';

export const community: CommunityPost[] = [
  {
    "id": "post_1",
    "authorId": "stu_1",
    "content": "سؤال بخصوص قانون نيوتن الثالث، هل يمكن لأحد أن يشرح لي التطبيقات العملية عليه؟",
    "likesCount": 15,
    "commentsCount": 4,
    "tags": [
      "فيزياء",
      "أسئلة"
    ],
    "createdAt": "2026-07-01T09:53:59.937Z"
  },
  {
    "id": "post_2",
    "authorId": "tch_1",
    "content": "طلابنا الأعزاء، تم رفع مذكرة المراجعة النهائية في قسم المرفقات، بالتوفيق للجميع.",
    "likesCount": 120,
    "commentsCount": 35,
    "tags": [
      "تنبيه هام",
      "مراجعة"
    ],
    "createdAt": "2026-07-01T09:47:19.937Z"
  }
];