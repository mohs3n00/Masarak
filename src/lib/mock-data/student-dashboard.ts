export const studentMockData = {
  profile: {
    name: 'Ahmed Yassin',
    email: 'ahmed.yassin@example.com',
    joinDate: 'Oct 2024',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    role: 'High School Student',
    level: 12,
    xp: 4500,
    nextLevelXp: 5000,
    streak: 14, // days
  },
  stats: {
    studyHours: 128,
    streak: 14,
    coursesCompleted: 4,
    lessonsCompleted: 86,
    certificates: 3,
  },
  continueLearning: {
    id: 'c1',
    title: 'Advanced Mathematics: Calculus Fundamentals',
    teacher: 'Dr. Mahmoud Fawzy',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    progress: 68,
    currentLesson: 'Derivatives and Rates of Change',
    remainingTime: '2h 15m',
    lastAccessed: '2 hours ago',
  },
  weeklyChart: [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.8 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 4.2 },
    { day: 'Fri', hours: 2.0 },
    { day: 'Sat', hours: 5.5 },
    { day: 'Sun', hours: 3.0 },
  ],
  upcomingLessons: [
    {
      id: 'l1',
      title: 'Physics Live Q&A',
      time: 'Today, 7:00 PM',
      type: 'LIVE',
    },
    {
      id: 'l2',
      title: 'Chemistry Quiz 3',
      time: 'Tomorrow, 10:00 AM',
      type: 'EXAM',
    },
    {
      id: 'l3',
      title: 'Biology Chapter 4 Review',
      time: 'Wed, 4:00 PM',
      type: 'LESSON',
    }
  ],
  recommendedCourses: [
    {
      id: 'r1',
      title: 'Mastering Organic Chemistry',
      teacher: 'Prof. Hassan Ali',
      rating: 4.9,
      students: 1240,
      price: '$45.00',
      thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157824810?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 'r2',
      title: 'Physics: Mechanics Deep Dive',
      teacher: 'Eng. Tarek Omar',
      rating: 4.8,
      students: 890,
      price: '$35.00',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=500',
    },
    {
      id: 'r3',
      title: 'English Grammar Masterclass',
      teacher: 'Sarah Jenkins',
      rating: 4.7,
      students: 2100,
      price: '$25.00',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=500',
    }
  ],
  achievements: [
    { id: 'a1', title: 'Fast Learner', description: 'Complete 5 lessons in one day', icon: 'zap', unlocked: true },
    { id: 'a2', title: 'Night Owl', description: 'Study after midnight', icon: 'moon', unlocked: true },
    { id: 'a3', title: 'Perfect Score', description: 'Get 100% on a major exam', icon: 'award', unlocked: false },
    { id: 'a4', title: 'Consistent', description: 'Maintain a 30-day streak', icon: 'flame', unlocked: false },
  ],
  notifications: [
    { id: 'n1', title: 'Assignment Graded', message: 'Calculus Quiz 2 was graded. You scored 95%.', time: '1h ago', unread: true },
    { id: 'n2', title: 'New Course Announcement', message: 'Dr. Fawzy just published a new revision video.', time: '3h ago', unread: true },
    { id: 'n3', title: 'Achievement Unlocked', message: 'You earned the "Night Owl" badge!', time: 'Yesterday', unread: false },
    { id: 'n4', title: 'Live Session Starting', message: 'Your Biology Live Session starts in 10 minutes.', time: 'Yesterday', unread: false },
    { id: 'n5', title: 'Course Completed', message: 'Congratulations on finishing Mechanics! Download your certificate.', time: '2 days ago', unread: false },
  ],
  allCourses: [
    { id: 'c1', title: 'Advanced Mathematics: Calculus Fundamentals', teacher: 'Dr. Mahmoud Fawzy', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800', progress: 68, totalLessons: 42, completedLessons: 28, lastAccessed: '2 hours ago', status: 'active' },
    { id: 'c2', title: 'Organic Chemistry: Reactions & Mechanisms', teacher: 'Prof. Hassan Ali', thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157824810?auto=format&fit=crop&q=80&w=800', progress: 100, totalLessons: 35, completedLessons: 35, lastAccessed: '1 week ago', status: 'completed' },
    { id: 'c3', title: 'Physics: Thermodynamics', teacher: 'Eng. Tarek Omar', thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=800', progress: 15, totalLessons: 20, completedLessons: 3, lastAccessed: 'Yesterday', status: 'active' },
    { id: 'c4', title: 'Arabic Grammar & Literature', teacher: 'Ustadh Kamal', thumbnail: 'https://images.unsplash.com/photo-1546410531-bea5aadcb6ce?auto=format&fit=crop&q=80&w=800', progress: 0, totalLessons: 50, completedLessons: 0, lastAccessed: 'Never', status: 'not-started' },
  ],
  recentlyViewed: [
    { id: 'v1', title: 'Integration by Parts (Lesson 12)', type: 'Video', course: 'Advanced Mathematics', time: '2 hours ago' },
    { id: 'v2', title: 'Thermodynamics Formula Sheet', type: 'PDF', course: 'Physics', time: 'Yesterday' },
    { id: 'v3', title: 'Quiz 3: Hydrocarbons', type: 'Quiz', course: 'Organic Chemistry', time: '3 days ago' },
  ],
  quickNotes: [
    { id: 'qn1', content: 'Remember the formula for integration by parts: ∫udv = uv - ∫vdu', date: 'Today' },
    { id: 'qn2', content: 'Ask Dr. Fawzy about the limit problem on page 42.', date: 'Yesterday' },
  ],
  certificates: [
    { id: 'cert1', title: 'Organic Chemistry Masterclass', issueDate: 'Oct 12, 2025', grade: '98%', courseId: 'c2', url: '#', verified: true },
    { id: 'cert2', title: 'Introduction to Biology', issueDate: 'Sep 05, 2025', grade: '92%', courseId: 'c5', url: '#', verified: true },
  ],
  bookmarks: [
    { id: 'b1', course: 'Advanced Mathematics', title: 'Complex Derivatives Example', time: '14:23', type: 'video' },
    { id: 'b2', course: 'Physics: Thermodynamics', title: 'Entropy definition', time: '02:15', type: 'video' },
    { id: 'b3', course: 'Advanced Mathematics', title: 'Important formula reference', time: '00:00', type: 'note' },
  ],
  courseDetails: {
    id: 'c1',
    title: 'Advanced Mathematics: Calculus Fundamentals',
    teacher: { name: 'Dr. Mahmoud Fawzy', role: 'Head of Mathematics Dept', avatar: 'https://i.pravatar.cc/150?u=dr_fawzy' },
    progress: 68,
    description: 'Master the fundamentals of calculus including limits, derivatives, integrals, and their applications in real-world physics and engineering problems.',
    objectives: ['Understand Limits and Continuity', 'Master Derivatives', 'Apply Integration Techniques', 'Solve Differential Equations'],
    requirements: ['Basic Algebra', 'Trigonometry Fundamentals'],
    sections: [
      { 
        id: 's1', title: '1. Limits and Continuity', 
        lessons: [
          { id: 'l1', title: 'Introduction to Limits', duration: '15:00', completed: true, type: 'video' },
          { id: 'l2', title: 'Calculating Limits Algebraically', duration: '22:30', completed: true, type: 'video' },
          { id: 'l3', title: 'Limits Quiz', duration: '10:00', completed: true, type: 'quiz' }
        ] 
      },
      { 
        id: 's2', title: '2. Derivatives', 
        lessons: [
          { id: 'l4', title: 'The Derivative as a Function', duration: '18:45', completed: true, type: 'video' },
          { id: 'l5', title: 'Differentiation Rules', duration: '25:10', completed: false, type: 'video', isCurrent: true },
          { id: 'l6', title: 'Chain Rule Practice', duration: '30:00', completed: false, type: 'video', locked: true }
        ] 
      }
    ],
    attachments: [
      { id: 'att1', name: 'Calculus Cheat Sheet.pdf', size: '2.4 MB' },
      { id: 'att2', name: 'Chapter 2 Exercises.docx', size: '1.1 MB' },
    ],
    faqs: [
      { question: 'Will there be live Q&A sessions?', answer: 'Yes, every Friday at 7 PM.' },
      { question: 'Do I need a graphing calculator?', answer: 'It is recommended but not strictly required.' }
    ],
    reviews: [
      { id: 'rev1', user: 'Omar Khaled', rating: 5, date: '2 weeks ago', comment: 'Dr. Fawzy explains very clearly!' },
      { id: 'rev2', user: 'Sara Ahmed', rating: 4, date: '1 month ago', comment: 'Great course, but the quizzes are very hard.' }
    ]
  }
};
