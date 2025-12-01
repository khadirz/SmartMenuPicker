
import { MenuItem, UserPreferences, ScoredMenuItem, CourseType, SpicinessLevel } from '../types';

// Helper to check if text contains any word from a list
const matchesKeywords = (text: string, keywords: string[]): boolean => {
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
};

export const calculateRecommendations = (items: MenuItem[], prefs: UserPreferences): ScoredMenuItem[] => {
  return items.map(item => {
    let score = 0;
    const reasons: string[] = [];
    
    const combinedText = (item.name + ' ' + item.description).toLowerCase();
    const itemProtein = item.tags.protein?.toLowerCase() || '';
    const itemCuisine = item.tags.cuisine?.toLowerCase() || '';
    const itemDietary = item.tags.dietary?.map(d => d.toLowerCase()) || [];
    
    // --- 1. CRITICAL FILTERS (Restrictions) ---
    if (prefs.restrictions === 'vegetarian') {
      if (!itemDietary.includes('vegetarian') && !itemDietary.includes('vegan') && item.tags.course !== CourseType.DRINK) {
         // Double check description for meats if tag is missing
         if (matchesKeywords(combinedText, ['beef', 'chicken', 'pork', 'lamb', 'fish', 'meat', 'bacon', 'steak'])) {
             score -= 1000;
         } else {
             // Maybe safe, but no tag
             score -= 50; 
         }
      } else {
         score += 10;
      }
    } else if (prefs.restrictions === 'vegan') {
      if (!itemDietary.includes('vegan')) {
         score -= 1000; 
      } else {
         score += 10;
      }
    } else if (prefs.restrictions === 'no-pork') {
      if (matchesKeywords(combinedText, ['pork', 'bacon', 'ham', 'sausage', 'chorizo', 'pepperoni'])) {
        score -= 1000;
      }
    } else if (prefs.restrictions === 'gluten-free') {
       if (!itemDietary.includes('gluten-free')) score -= 100; // Strong penalty but maybe kitchen can adapt
       else score += 10;
    }

    // --- 2. PROTEIN MATCHING ---
    if (prefs.protein !== 'any') {
      let proteinMatch = false;
      if (prefs.protein === 'beef' && matchesKeywords(combinedText, ['beef', 'steak', 'burger', 'ribs', 'veal', 'meatball'])) proteinMatch = true;
      if (prefs.protein === 'chicken' && matchesKeywords(combinedText, ['chicken', 'turkey', 'wings', 'duck', 'poultry'])) proteinMatch = true;
      if (prefs.protein === 'seafood' && matchesKeywords(combinedText, ['fish', 'salmon', 'tuna', 'shrimp', 'prawn', 'crab', 'lobster', 'seafood', 'calamari'])) proteinMatch = true;
      if (prefs.protein === 'vegetarian' && (itemDietary.includes('vegetarian') || matchesKeywords(combinedText, ['tofu', 'bean', 'lentil', 'chickpea', 'vegetable']))) proteinMatch = true;

      if (proteinMatch) {
        score += 20;
        reasons.push(`Perfect choice for ${prefs.protein} lovers`);
      } else if (item.tags.course === CourseType.MAIN) {
        // If it's a main and doesn't match preferred protein, penalty
        score -= 10;
      }
    }

    // --- 3. CUISINE VIBE ---
    if (prefs.cuisine !== 'any') {
      if (itemCuisine.includes(prefs.cuisine) || combinedText.includes(prefs.cuisine)) {
        score += 15;
        reasons.push(`Hits that ${prefs.cuisine} craving`);
      } else {
        // Broad cuisine mapping
        if (prefs.cuisine === 'asian' && matchesKeywords(combinedText, ['thai', 'chinese', 'japanese', 'curry', 'sushi', 'noodle', 'soy', 'teriyaki'])) {
           score += 15;
           reasons.push("Spot on Asian flavors");
        }
        if (prefs.cuisine === 'italian' && matchesKeywords(combinedText, ['pasta', 'pizza', 'risotto', 'parmesan', 'tomato', 'basil'])) {
           score += 15;
           reasons.push("Classic Italian vibes");
        }
        if (prefs.cuisine === 'mexican' && matchesKeywords(combinedText, ['taco', 'burrito', 'salsa', 'nacho', 'quesadilla', 'bean'])) {
           score += 15;
           reasons.push("Mexican style favorite");
        }
        if (prefs.cuisine === 'american' && matchesKeywords(combinedText, ['burger', 'fries', 'grill', 'bbq', 'sandwich', 'steak'])) {
           score += 15;
           reasons.push("Great American comfort food");
        }
      }
    }

    // --- 4. FLAVOR PROFILE (Advanced Keyword Scoring) ---
    if (prefs.flavorProfile === 'creamy') {
      if (matchesKeywords(combinedText, ['cream', 'cheese', 'butter', 'alfredo', 'bisque', 'rich', 'yogurt', 'coconut milk'])) {
        score += 15;
        reasons.push("Rich and creamy texture");
      }
    }
    if (prefs.flavorProfile === 'savory') {
      if (matchesKeywords(combinedText, ['soy', 'miso', 'truffle', 'mushroom', 'steak', 'garlic', 'roasted', 'gravy'])) {
        score += 15;
        reasons.push("Deep savory umami flavors");
      }
    }
    if (prefs.flavorProfile === 'fresh') {
      if (matchesKeywords(combinedText, ['salad', 'citrus', 'lemon', 'lime', 'herb', 'mint', 'basil', 'raw', 'fruit', 'vinaigrette'])) {
        score += 15;
        reasons.push("Fresh and zesty notes");
      }
    }
    if (prefs.flavorProfile === 'smoky') {
      if (matchesKeywords(combinedText, ['smoke', 'bbq', 'charred', 'grilled', 'wood', 'bacon', 'chipotle'])) {
        score += 15;
        reasons.push("Smoky and grilled to perfection");
      }
    }
    if (prefs.flavorProfile === 'sweet-spicy') {
      if (matchesKeywords(combinedText, ['sweet chili', 'honey', 'mango', 'pineapple', 'teriyaki', 'glaze']) && item.tags.spiciness !== 'none') {
        score += 15;
        reasons.push("Delicious sweet & spicy combo");
      }
    }

    // --- 5. TEXTURE & PREPARATION ---
    if (prefs.texture === 'crispy') {
       if (matchesKeywords(combinedText, ['fried', 'crispy', 'crunchy', 'breaded', 'battered', 'tempura', 'schnitzel'])) {
         score += 12;
         reasons.push("Has that crunch you wanted");
       }
    }
    if (prefs.texture === 'grilled') {
       if (matchesKeywords(combinedText, ['grilled', 'charred', 'roasted', 'seared'])) {
         score += 12;
         reasons.push("Fire-grilled goodness");
       }
    }
    if (prefs.texture === 'saucy') {
       if (matchesKeywords(combinedText, ['stew', 'curry', 'sauce', 'braised', 'soup', 'gravy', 'risotto'])) {
         score += 12;
         reasons.push("Saucy and comforting");
       }
    }
    if (prefs.texture === 'raw') {
       if (matchesKeywords(combinedText, ['salad', 'raw', 'sashimi', 'tartare', 'carpaccio', 'cold'])) {
         score += 12;
         reasons.push("Fresh and crisp");
       }
    }

    // --- 6. BALANCE (Light vs Heavy) ---
    if (prefs.balance === 'light') {
       if (item.tags.course === CourseType.STARTER || matchesKeywords(combinedText, ['salad', 'soup', 'steamed', 'grilled chicken', 'fish'])) {
          score += 10;
       }
       if (matchesKeywords(combinedText, ['cream', 'fried', 'burger', 'pasta', 'cheese'])) {
          score -= 10;
       }
    }
    if (prefs.balance === 'heavy') {
       if (matchesKeywords(combinedText, ['burger', 'pasta', 'fried', 'cheese', 'cream', 'steak', 'potato'])) {
          score += 10;
          reasons.push("A hearty, indulgent meal");
       }
       if (item.tags.course === CourseType.STARTER && !matchesKeywords(combinedText, ['wings', 'nachos'])) {
          score -= 5;
       }
    }

    // --- 7. SPICINESS ---
    const itemSpice = item.tags.spiciness || SpicinessLevel.NONE;
    if (prefs.spiciness === 'none') {
      if (itemSpice !== SpicinessLevel.NONE && itemSpice !== SpicinessLevel.MILD) score -= 30; // Too spicy penalty
    } else if (prefs.spiciness === 'hot') {
      if (itemSpice === SpicinessLevel.HOT || itemSpice === SpicinessLevel.MEDIUM) {
        score += 10;
        reasons.push("Packs the heat you like");
      } else {
        score -= 5; // Boring
      }
    }

    // --- 8. ADVENTUROUSNESS ---
    const isCommon = matchesKeywords(combinedText, ['burger', 'pizza', 'pasta', 'chicken', 'caesar', 'fries', 'sandwich']);
    if (prefs.adventurousness === 'high') {
       if (!isCommon) {
         score += 10;
         reasons.push("A unique, adventurous choice");
       } else {
         score -= 5;
       }
    } else if (prefs.adventurousness === 'low') {
       if (isCommon) {
         score += 10;
         reasons.push("A safe, familiar favorite");
       } else {
         score -= 10; // Too risky
       }
    }

    // --- 9. BUDGET ---
    const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    if (!isNaN(priceNum)) {
        if (prefs.budget === 'low' && priceNum < 18) score += 8;
        if (prefs.budget === 'high' && priceNum > 25) score += 8; // Bonus for premium items if budget allows
    }

    // --- 10. DESSERT HANDLING ---
    if (item.tags.course === CourseType.DESSERT) {
      if (prefs.dessert === 'no') score = -100; // Remove from contention mostly
      if (prefs.dessert === 'yes') score += 15;
      if (prefs.dessert === 'maybe') score += 5;
    }

    // Final clean up of reasons
    const uniqueReasons = Array.from(new Set(reasons));
    
    return {
      ...item,
      score,
      matchReason: uniqueReasons.slice(0, 2).join('. ') || "Matches your general taste profile."
    };
  }).sort((a, b) => b.score - a.score);
};
