export type QuestionType = 'MULTIPLE_CHOICE' | 'MULTIPLE_RESPONSE' | 'TRUE_FALSE' | 'SHORT_TEXT';

export interface Choice {
  id?: string;
  text: string;
  isCorrect: boolean;
  order?: number;
  imageUrl?: string;
}

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  points: number;
  order?: number;
  imageUrl?: string;
  explanation?: string;
  choices: Choice[];
}

export interface ExamSettings {
  title: string;
  description?: string;
  instructions?: string;
  durationMin: number;
  passingScore: number;
  passingScoreType: 'PERCENTAGE' | 'MARKS';
  attemptsLimit: number;
  availableFrom?: string;
  availableUntil?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  rules?: {
    randomizeQuestions?: boolean;
    randomizeAnswers?: boolean;
    reviewAnswers?: boolean;
    showCorrectAnswers?: boolean;
    showExplanations?: boolean;
    showScore?: 'IMMEDIATELY' | 'LATER' | 'NEVER';
    [key: string]: any;
  };
}

export interface ExamTemplate extends ExamSettings {
  id?: string;
  lessonId: string;
  questions: Question[];
}
