
export type AppView = 'dashboard' | 'activities' | 'lesson-plans' | 'summaries' | 'materials' | 'adjust-levels' | 'visual-materials' | 'stories' | 'plans' | 'welcome-pro';

export interface ActivityParams {
  age: number;
  grade?: string;
  objective: string;
  estimatedTime: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface ActivityAdjustmentParams {
  originalActivity: string;
  age: number;
}

export interface StoryParams {
  mode: 'educational' | 'sleep';
  age: number;
  theme: string;
  message?: string;
  charName?: string;
  duration?: 'curta' | 'média';
}

export interface LessonPlanParams {
  theme: string;
  objective: string;
  ageRange: string;
  estimatedTime: string;
}

export interface ParentSummaryParams {
  age: number;
  weekWork: string;
  highlights: string;
  observations?: string;
}

export interface VisualMaterialParams {
  theme: string;
  age: number;
  objective: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  type: 'pdf' | 'image' | 'text';
  content?: string;
  date: string;
}
