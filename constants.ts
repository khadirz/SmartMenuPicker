
import { Question } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 'restrictions',
    text: "First, do you have any strict dietary requirements?",
    options: [
      { label: "No restrictions", value: "none" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Vegan", value: "vegan" },
      { label: "No Pork", value: "no-pork" },
      { label: "Gluten-Free", value: "gluten-free" }
    ]
  },
  {
    id: 'protein',
    text: "What main ingredient are you in the mood for?",
    options: [
      { label: "Beef / Red Meat", value: "beef" },
      { label: "Chicken / Poultry", value: "chicken" },
      { label: "Seafood / Fish", value: "seafood" },
      { label: "Plant-based / Veggies", value: "vegetarian" },
      { label: "Surprise me (Anything goes)", value: "any" }
    ]
  },
  {
    id: 'cuisine',
    text: "Which culinary vibe matches your current mood?",
    options: [
      { label: "Italian / Pasta / Mediterranean", value: "italian" },
      { label: "Asian (Thai/Chinese/Sushi)", value: "asian" },
      { label: "Mexican / Latin American", value: "mexican" },
      { label: "American Grill / Burgers", value: "american" },
      { label: "Open to anything", value: "any" }
    ]
  },
  {
    id: 'spiciness',
    text: "How much heat can you handle?",
    options: [
      { label: "None (Zero spice)", value: "none" },
      { label: "Mild (Just a tickle)", value: "mild" },
      { label: "Medium (Nice kick)", value: "medium" },
      { label: "Hot (Bring the fire)", value: "hot" }
    ]
  },
  {
    id: 'flavorProfile',
    text: "What specific flavor profile is your palate craving?",
    options: [
      { label: "Rich, Creamy & Cheesy", value: "creamy" },
      { label: "Deep Savory & Umami (Salty/Meaty)", value: "savory" },
      { label: "Fresh, Zesty & Citrusy", value: "fresh" },
      { label: "Smoky & BBQ", value: "smoky" },
      { label: "Sweet & Spicy", value: "sweet-spicy" }
    ]
  },
  {
    id: 'texture',
    text: "How about texture? How do you want it prepared?",
    options: [
      { label: "Crispy, Fried, or Breaded", value: "crispy" },
      { label: "Grilled, Charred, or Seared", value: "grilled" },
      { label: "Saucy, Soft, or Stewed", value: "saucy" },
      { label: "Fresh, Raw, or Cold", value: "raw" },
      { label: "No specific preference", value: "any" }
    ]
  },
  {
    id: 'balance',
    text: "Are you looking for something Light or Indulgent?",
    options: [
      { label: "Light & Healthy (Salads, Steamed)", value: "light" },
      { label: "Balanced & Wholesome", value: "balanced" },
      { label: "Heavy, Rich & Comforting", value: "heavy" }
    ]
  },
  {
    id: 'adventurousness',
    text: "How risky do you want to be with your choice?",
    options: [
      { label: "Stick to safe, familiar comfort food", value: "low" },
      { label: "Willing to try something a bit different", value: "medium" },
      { label: "I want an exotic food adventure", value: "high" }
    ]
  },
  {
    id: 'budget',
    text: "What's the budget for this meal?",
    options: [
      { label: "Budget-friendly / Value", value: "low" },
      { label: "Standard / Mid-range", value: "medium" },
      { label: "Splurge / Premium", value: "high" }
    ]
  },
  {
    id: 'dessert',
    text: "Finally, are we saving room for dessert?",
    options: [
      { label: "Yes, definitely!", value: "yes" },
      { label: "No, savory food only", value: "no" },
      { label: "Maybe, if it matches the meal", value: "maybe" }
    ]
  }
];
