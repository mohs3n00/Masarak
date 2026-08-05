export const COMMUNITY_CATEGORIES = [
  { id: 'SECONDARY_GRADE_3', label: 'الصف الثالث الثانوي', description: 'تجمع خاص بطلاب الصف الثالث الثانوي' },
  { id: 'SECONDARY_GRADE_2', label: 'الصف الثاني الثانوي', description: 'تجمع خاص بطلاب الصف الثاني الثانوي' },
  { id: 'SECONDARY_GRADE_1', label: 'الصف الأول الثانوي', description: 'تجمع خاص بطلاب الصف الأول الثانوي' },
  { id: 'EDUCATION', label: 'المواد الدراسية', description: 'مجتمعات للمواد الدراسية (فيزياء، كيمياء، لغات، إلخ)' },
  { id: 'UNIVERSITY', label: 'الجامعة والتنسيق', description: 'نصائح وتوجيهات للقبول الجامعي' },
  { id: 'GENERAL', label: 'نصائح وتوجيه', description: 'تنظيم الوقت، طرق المذاكرة، وتحفيز' },
] as const;

export const COMMUNITY_VISIBILITIES = [
  { id: 'PUBLIC', label: 'عام للجميع', description: 'يمكن لأي طالب أو معلم الانضمام وقراءة المحتوى بدون قيود' },
  { id: 'APPROVAL_REQUIRED', label: 'يتطلب موافقة الانضمام', description: 'يستطيع الجميع رؤية المجتمع لكن المشاركة تتطلب موافقة الأدمن' },
  { id: 'PRIVATE', label: 'خاص ودعوات فقط', description: 'مجتمع سري لا يظهر في البحث ويحتاج رابط دعوة للانضمام' },
] as const;
