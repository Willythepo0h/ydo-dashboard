export const subCategoryNormalization: Record<string, Record<string, string>> = {
  'Scholarship For Senior High School Students': {
    '': 'Academic Scholarship',
    'Academic Scholarship': 'Academic Scholarship',
    'Athletic And Arts Scholarship': 'Athletic and Arts Scholarship',
    'Youth Leaders Scholarship': 'Youth Leaders Scholarship',
    'Specialized Track': 'Specialized Track Scholarship',
  },
  'Scholarship For Tertiary Students': {
    'Academic Scholarship': 'Academic Scholarship',
    'Academic Scholarship (Rank 1-2)': 'Academic Scholarship',
    'Academic Scholarship (Rank 3-10)': 'Academic Scholarship',
    'Economic Scholarship': 'Economic Scholarship',
    'Excel Scholarship': 'Excel Scholarship',
    'Youth Leaders Scholarship': 'Youth Leaders Scholarship',
    'Specialized Courses Scholarship': 'Specialized Courses Scholarship',
    'Athletic And Arts Scholarship': 'Athletic And Arts Scholarship',
  },
};

export const UNKNOWN_SUBCATEGORY = '-';

export function normalizeSubCategory(category: string, subCategory?: string) {
  const cleanSub = (subCategory || '').trim();

  // Return placeholder for empty or 'n/a'
  if (!cleanSub || ['n/a', 'not applicable'].includes(cleanSub.toLowerCase())) {
    return UNKNOWN_SUBCATEGORY;
  }

  // Try exact match first, then case-insensitive key
  const mapped =
    subCategoryNormalization[category]?.[cleanSub] ??
    subCategoryNormalization[category]?.[cleanSub.toLowerCase()];

  return mapped ?? cleanSub;
}
