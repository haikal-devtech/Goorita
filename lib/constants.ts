export const LOCATIONS = {
  origins: [
    { country: 'Indonesia', code: 'ID' }
  ],
  originProvinces: [
    { name: 'DKI Jakarta', code: 'JKT', isPickupAvailable: true },
    { name: 'Bali', code: 'BALI', isPickupAvailable: true },
    { name: 'Jawa Barat', code: 'JBR', isPickupAvailable: false },
    { name: 'Jawa Timur', code: 'JTM', isPickupAvailable: false },
  ],
  destinations: [
    { country: 'United States', code: 'US', zone: 'US' },
    { country: 'Canada', code: 'CA', zone: 'Z5' },
    { country: 'Mexico', code: 'MX', zone: 'Z5' },
    { country: 'Australia', code: 'AU', zone: 'AU' },
    { country: 'New Zealand', code: 'NZ', zone: 'Z4' },
    { country: 'Papua New Guinea', code: 'PG', zone: 'Z4' },
    { country: 'United Kingdom', code: 'GB', zone: 'UK' },
    { country: 'Saudi Arabia', code: 'SA', zone: 'SA' },
    { country: 'Egypt', code: 'EG', zone: 'EG' },
    { country: 'UAE', code: 'AE', zone: 'Z6' },
    { country: 'Bahrain', code: 'BH', zone: 'Z6' },
    { country: 'Jordan', code: 'JO', zone: 'Z6' },
    { country: 'Kuwait', code: 'KW', zone: 'Z6' },
    { country: 'Oman', code: 'OM', zone: 'Z6' },
    { country: 'Qatar', code: 'QA', zone: 'Z6' },
    // Southeast Asia
    { country: 'Singapore', code: 'SG', zone: 'SG' },
    { country: 'Malaysia', code: 'MY', zone: 'MY-W' }, // Default to MY-W, logic can handle split later if needed
    { country: 'Philippines', code: 'PH', zone: 'PH' },
    { country: 'Thailand', code: 'TH', zone: 'TH' },
    { country: 'Vietnam', code: 'VN', zone: 'VN' },
    { country: 'Brunei', code: 'BN', zone: 'Z2' },
    { country: 'Cambodia', code: 'KH', zone: 'Z2' },
    { country: 'Laos', code: 'LA', zone: 'Z2' },
    { country: 'Myanmar', code: 'MM', zone: 'Z2' },
    { country: 'Timor-Leste', code: 'TL', zone: 'Z1' },
    // Other Asia
    { country: 'Japan', code: 'JP', zone: 'JP' },
    { country: 'South Korea', code: 'KR', zone: 'KR' },
    { country: 'Hong Kong', code: 'HK', zone: 'HK' },
    { country: 'China', code: 'CN', zone: 'CN' },
    { country: 'India', code: 'IN', zone: 'IN' },
    { country: 'Bangladesh', code: 'BD', zone: 'Z6' },
    { country: 'Maldives', code: 'MV', zone: 'Z6' },
    { country: 'Nepal', code: 'NP', zone: 'Z6' },
    { country: 'Pakistan', code: 'PK', zone: 'Z6' },
    { country: 'Sri Lanka', code: 'LK', zone: 'Z6' },
    { country: 'Macau', code: 'MO', zone: 'Z2' },
    { country: 'Taiwan', code: 'TW', zone: 'Z4' },
    // Europe
    { country: 'Netherlands', code: 'NL', zone: 'EU1' },
    { country: 'Belgium', code: 'BE', zone: 'EU1' },
    { country: 'Luxembourg', code: 'LU', zone: 'EU1' },
    { country: 'Germany', code: 'DE', zone: 'EU1' },
    { country: 'France', code: 'FR', zone: 'EU2' },
    { country: 'Denmark', code: 'DK', zone: 'EU2' },
    { country: 'Italy', code: 'IT', zone: 'EU2' },
    { country: 'Monaco', code: 'MC', zone: 'EU2' },
    { country: 'Finland', code: 'FI', zone: 'EU3' },
    { country: 'Ireland', code: 'IE', zone: 'EU3' },
    { country: 'Austria', code: 'AT', zone: 'EU3' },
    { country: 'Portugal', code: 'PT', zone: 'EU3' },
    { country: 'Spain', code: 'ES', zone: 'EU3' },
    { country: 'Sweden', code: 'SE', zone: 'EU3' },
    { country: 'Poland', code: 'PL', zone: 'EU3' },
    { country: 'Czech Republic', code: 'CZ', zone: 'EU3' },
    { country: 'Bulgaria', code: 'BG', zone: 'EU4' },
    { country: 'Estonia', code: 'EE', zone: 'EU4' },
    { country: 'Greece', code: 'GR', zone: 'EU4' },
    { country: 'Hungary', code: 'HU', zone: 'EU4' },
    { country: 'Croatia', code: 'HR', zone: 'EU4' },
    { country: 'Latvia', code: 'LV', zone: 'EU4' },
    { country: 'Lithuania', code: 'LT', zone: 'EU4' },
    { country: 'Romania', code: 'RO', zone: 'EU4' },
    { country: 'Slovenia', code: 'SI', zone: 'EU4' },
    { country: 'Slovak Republic', code: 'SK', zone: 'EU4' },
    { country: 'Turkey', code: 'TR', zone: 'Z7' },
    { country: 'South Africa', code: 'ZA', zone: 'Z7' },
  ],
};

export const POSTAL_CODES: Record<string, any[]> = {
  'SG': [
    { code: '048616', city: 'Singapore', state: 'Singapore' },
    { code: '098311', city: 'Singapore', state: 'Singapore' },
  ],
  'US': [
    { code: '10001', city: 'New York', state: 'NY' },
    { code: '90001', city: 'Los Angeles', state: 'CA' },
    { code: '99501', city: 'Anchorage', state: 'AK', isRemote: true }, // Remote area
  ],
  'ID': [
    { code: '12190', city: 'Jakarta Selatan', state: 'DKI Jakarta' },
    { code: '11110', city: 'Jakarta Barat', state: 'DKI Jakarta' },
    { code: '80361', city: 'Badung', state: 'Bali' },
    { code: '40111', city: 'Bandung', state: 'Jawa Barat' },
  ]
};

// Rates in IDR per kg based on Zone
export const RATES: Record<string, { saver: number; express: number; transitSaver: string; transitExpress: string; }> = {
  'US': { saver: 380000, express: 434000, transitSaver: '7-10 days', transitExpress: '4-5 days' },
  'AU': { saver: 200000, express: 434000, transitSaver: '5-7 days', transitExpress: '3-4 days' },
  'GB': { saver: 190000, express: 525000, transitSaver: '6-9 days', transitExpress: '3-5 days' },
  'EU1': { saver: 355000, express: 525000, transitSaver: '6-9 days', transitExpress: '3-5 days' },
  'EU2': { saver: 535000, express: 525000, transitSaver: '6-9 days', transitExpress: '3-5 days' },
  'EU3': { saver: 620000, express: 525000, transitSaver: '6-9 days', transitExpress: '3-5 days' },
  'EU4': { saver: 735000, express: 525000, transitSaver: '6-9 days', transitExpress: '3-5 days' },
  'SA': { saver: 280000, express: 525000, transitSaver: '5-7 days', transitExpress: '3-4 days' },
  'EG': { saver: 85000, express: 608000, transitSaver: '6-8 days', transitExpress: '4-5 days' },
  'SG': { saver: 63000, express: 319000, transitSaver: '2-4 days', transitExpress: '1-2 days' },
  'MY-W': { saver: 68000, express: 343000, transitSaver: '2-4 days', transitExpress: '1-2 days' },
  'MY-E': { saver: 118000, express: 343000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'PH': { saver: 215000, express: 343000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'TH': { saver: 215000, express: 343000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'VN': { saver: 215000, express: 343000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'JP': { saver: 210000, express: 369000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'KR': { saver: 200000, express: 434000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'HK': { saver: 200000, express: 343000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'CN': { saver: 225000, express: 369000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  'IN': { saver: 220000, express: 525000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
  // Fallbacks
  'SEA': { saver: 68000, express: 150000, transitSaver: '2-4 days', transitExpress: '1-2 days' },
  'OASIA': { saver: 200000, express: 250000, transitSaver: '3-5 days', transitExpress: '2-3 days' },
};

export const REMOTE_AREA_SURCHARGE = 250000;
export const INSURANCE_RATE = 0.005; // 0.5% of declared value
