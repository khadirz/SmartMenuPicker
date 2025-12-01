
export enum AppStep {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  PREVIEW = 'PREVIEW',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  RESULTS = 'RESULTS',
}

export enum CourseType {
  STARTER = 'starter',
  MAIN = 'main',
  DESSERT = 'dessert',
  DRINK = 'drink',
  SIDE = 'side',
  UNKNOWN = 'unknown'
}

export enum SpicinessLevel {
  NONE = 'none',
  MILD = 'mild',
  MEDIUM = 'medium',
  HOT = 'hot'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  tags: {
    course: CourseType;
    protein: string; // e.g., 'beef', 'chicken', 'vegetarian', 'vegan'
    cuisine: string;
    spiciness: SpicinessLevel;
    dietary: string[]; // e.g., 'gluten-free', 'vegan'
  };
}

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
}

export interface UserPreferences {
  restrictions: string;
  protein: string;
  cuisine: string;
  spiciness: string;
  flavorProfile: string; // e.g. savory, fresh, creamy
  texture: string;      // e.g. crispy, grilled, soft
  balance: string;      // e.g. light, heavy/comfort
  adventurousness: string;
  budget: string;
  dessert: string;
}

export interface ScoredMenuItem extends MenuItem {
  score: number;
  matchReason: string;
}
