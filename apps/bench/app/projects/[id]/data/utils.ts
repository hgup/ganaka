// The canonical columns your database requires
export const REQUIRED_FIELDS = [
  { 
    key: 'origin', 
    label: 'Origin Period', 
    synonyms: ['ay', 'uw', 'underwriting year', 'period', 'year', 'origin', 'accident'] 
  },
  { 
    key: 'development', 
    label: 'Development Period', 
    synonyms: ['dev', 'lag', 'age', 'months', 'period', 'development'] 
  },
  { 
    key: 'index', 
    label: 'Index of Data', 
    synonyms: ['GRNAME', 'GRCODE', 'index'] 
  },
  { 
    key: 'lob', 
    label: 'Line of Business', 
    synonyms: ['class', 'segment', 'business', 'lob', 'product', 'group'] 
  },
];

export function performAutoMapping(headers: string[]) {
  const newMapping: Record<string, string> = {};
  const usedHeaders = new Set<string>();

  REQUIRED_FIELDS.forEach((field) => {
    let bestHeader = "";
    let maxScore = 0;

    headers.forEach((header) => {
      if (usedHeaders.has(header)) return;

      const h = header.toLowerCase().trim();
      
      // 1. Check for exact match with key or synonyms
      if (h === field.key || field.synonyms.includes(h)) {
        bestHeader = header;
        maxScore = 100;
      } 
      
      // 2. Fuzzy substring match (if no exact match found yet)
      else if (maxScore < 100) {
        field.synonyms.forEach(syn => {
          if (h.includes(syn) || syn.includes(h)) {
            const score = (syn.length / h.length) * 80;
            if (score > maxScore) {
              maxScore = score;
              bestHeader = header;
            }
          }
        });
      }
    });

    if (bestHeader && maxScore > 40) {
      newMapping[bestHeader] = field.key;
      usedHeaders.add(bestHeader);
    }
  });

  return newMapping;
}