import { PackageItem, calculateTotalChargeableWeight } from './shipping';

// Database mock since user will set it up later
export interface CountryShippingRule {
  country_code: string;
  incoterms_allowed: ('DDU' | 'DDP')[];
  ddp_included_in_rate: boolean;
  ddp_per_kg: number;
  ddp_minimum: number;
  handling_surcharge: number;
  handling_condition_weight_kg: number | null;
  handling_condition_length_cm: number | null;
  handling_condition_girth_cm: number | null;
  remote_area_surcharge: number | null;
}

const MOCK_DB_RULES: Record<string, CountryShippingRule> = {
  // USA
  'US': {
    country_code: 'US',
    incoterms_allowed: ['DDP'],
    ddp_included_in_rate: false,
    ddp_per_kg: 15000,
    ddp_minimum: 30000,
    handling_surcharge: 250000,
    handling_condition_weight_kg: 22,
    handling_condition_length_cm: 121,
    handling_condition_girth_cm: 266, // 2xL + 2xW
    remote_area_surcharge: null,
  },
  // AUSTRALIA
  'AU': {
    country_code: 'AU',
    incoterms_allowed: ['DDP'],
    ddp_included_in_rate: true,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 300000,
    handling_condition_weight_kg: 30,
    handling_condition_length_cm: 100,
    handling_condition_girth_cm: null,
    remote_area_surcharge: null,
  },
  // UK
  'GB': {
    country_code: 'GB',
    incoterms_allowed: ['DDP'],
    ddp_included_in_rate: true,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 1000000,
    handling_condition_weight_kg: 30,
    handling_condition_length_cm: 175,
    handling_condition_girth_cm: 300,
    remote_area_surcharge: null,
  },
  // SAUDI ARABIA
  'SA': {
    country_code: 'SA',
    incoterms_allowed: ['DDP'],
    ddp_included_in_rate: true,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 0,
    handling_condition_weight_kg: null,
    handling_condition_length_cm: null,
    handling_condition_girth_cm: null,
    remote_area_surcharge: null,
  },
  // EGYPT
  'EG': {
    country_code: 'EG',
    incoterms_allowed: ['DDP'],
    ddp_included_in_rate: false,
    ddp_per_kg: 25000,
    ddp_minimum: 50000,
    handling_surcharge: 0,
    handling_condition_weight_kg: null,
    handling_condition_length_cm: null,
    handling_condition_girth_cm: null,
    remote_area_surcharge: null,
  },
  // SINGAPORE
  'SG': {
    country_code: 'SG',
    incoterms_allowed: ['DDU'],
    ddp_included_in_rate: false,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 0,
    handling_condition_weight_kg: null,
    handling_condition_length_cm: null,
    handling_condition_girth_cm: null,
    remote_area_surcharge: 350000,
  },
  // MALAYSIA WEST
  'MY-W': {
    country_code: 'MY-W',
    incoterms_allowed: ['DDU'],
    ddp_included_in_rate: false,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 0,
    handling_condition_weight_kg: null,
    handling_condition_length_cm: null,
    handling_condition_girth_cm: null,
    remote_area_surcharge: 350000,
  },
  // MALAYSIA EAST
  'MY-E': {
    country_code: 'MY-E',
    incoterms_allowed: ['DDU'],
    ddp_included_in_rate: false,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 0,
    handling_condition_weight_kg: null,
    handling_condition_length_cm: null,
    handling_condition_girth_cm: null,
    remote_area_surcharge: 350000,
  },
};

// EUROPE DEFAULT FALLBACK (NL, BE, LU, DE, FR, DK, IT, MC, FI, IE, AT, PT, ES, SE, PL, CZ, BG, EE, GR, HU, HR, LV, LT, RO, SI, SK)
const EUROPE_DEFAULT: CountryShippingRule = {
  country_code: 'EU',
  incoterms_allowed: ['DDP'],
  ddp_included_in_rate: false,
  ddp_per_kg: 25000,
  ddp_minimum: 50000,
  handling_surcharge: 1350000,
  handling_condition_weight_kg: 40,
  handling_condition_length_cm: null,
  handling_condition_girth_cm: 300,
  remote_area_surcharge: null,
};

// ASIA DEFAULT FALLBACK (PH, TH, VN, JP, KR, HK, CN, IN)
const ASIA_DEFAULT: CountryShippingRule = {
    country_code: 'ASIA',
    incoterms_allowed: ['DDU'],
    ddp_included_in_rate: false,
    ddp_per_kg: 0,
    ddp_minimum: 0,
    handling_surcharge: 400000,
    handling_condition_weight_kg: 20,
    handling_condition_length_cm: 120,
    handling_condition_girth_cm: null,
    remote_area_surcharge: 350000,
};

const EUROPE_CODES = ['NL','BE','LU','DE','FR','DK','IT','MC','FI','IE','AT','PT','ES','SE','PL','CZ','BG','EE','GR','HU','HR','LV','LT','RO','SI','SK'];

export async function fetchCountryShippingRule(countryCode: string): Promise<CountryShippingRule> {
  const code = countryCode.toUpperCase();
  if (MOCK_DB_RULES[code]) return MOCK_DB_RULES[code];
  if (EUROPE_CODES.includes(code)) return { ...EUROPE_DEFAULT, country_code: code };
  return { ...ASIA_DEFAULT, country_code: code };
}

export async function getBaseShippingRate(
  zone: string,
  service: 'saver' | 'express',
  actualWeight: number,
  volumeWeight: number
): Promise<number> {
  const chargeableWeight = Math.max(actualWeight, volumeWeight);
  const isPerKg = chargeableWeight >= 31;
  const roundedWeight = isPerKg ? Math.ceil(chargeableWeight) : Math.ceil(chargeableWeight * 2) / 2;

  // TODO: Implement actual Supabase query
  // const tableName = isPerKg ? 'shipping_rates_per_kg' : 'shipping_rates_tiered';
  // const { data } = await supabase.from(tableName).select('price')
  //   .eq('zone', zone).eq('service', service).eq('weight', roundedWeight).single();
  // return isPerKg ? data.price * roundedWeight : data.price;

  // --- MOCK DATABASE RESPONSE ---
  // Using simplified formulas that mimic the PDF data for development purposes.

  if (isPerKg) {
    let pricePerKg = 145000;
    if (zone === 'AU') pricePerKg = 100000;
    if (zone.startsWith('EU')) {
      const euRates: Record<string, number> = { 'EU1': 145000, 'EU2': 155000, 'EU3': 160000, 'EU4': 175000 };
      pricePerKg = euRates[zone] || 145000;
    }
    if (zone === 'SEA') pricePerKg = 85000;
    if (zone === 'SG') pricePerKg = 44000;
    if (zone === 'MY-W') pricePerKg = 44000;
    if (zone === 'MY-E') pricePerKg = 100000;
    
    // Express rates are generally higher per kg
    if (service === 'express') pricePerKg += 50000;

    return pricePerKg * roundedWeight;
  }

  // Tiered table mock (weight <= 30kg)
  if (service === 'saver') {
    // Specific check for Finland (EU3) 6kg as mentioned by the user
    if (zone.startsWith('EU') && roundedWeight === 6) {
      if (zone === 'EU1') return 1070000;
      if (zone === 'EU2') return 1250000;
      if (zone === 'EU3') return 1330000;
      if (zone === 'EU4') return 1505000;
    }

    // Default mock formula for Tiered Base Rate
    let base = 200000;
    let stepPrice = 50000;

    if (zone.startsWith('EU')) {
      base = 355000;
      stepPrice = 75000;
    } else if (zone === 'US') {
      base = 380000;
      stepPrice = 60000;
    } else if (zone === 'SG' || zone.startsWith('MY')) {
      base = 63000;
      stepPrice = 30000;
    } else if (zone === 'SEA' || zone === 'PH' || zone === 'VN' || zone === 'TH' || zone === 'Z1' || zone === 'Z2' || zone === 'JP' || zone === 'KR' || zone === 'HK' || zone === 'CN' || zone === 'IN' || zone.startsWith('Z')) {
      base = 150000;
      stepPrice = 30000;
    }

    return base + ((roundedWeight - 0.5) * 2) * stepPrice;
  } else {
    // Express mock
    return 500000 + (roundedWeight * 2) * 80000;
  }
}

export function calculateSurcharges(
  rule: CountryShippingRule, 
  packages: PackageItem[], 
  selectedIncoterm: 'DDU' | 'DDP',
  isRemoteArea: boolean
) {
  const totalWeight = calculateTotalChargeableWeight(packages);
  const totalWeightCeil = Math.ceil(totalWeight);
  
  let ddpSurcharge = 0;
  if (selectedIncoterm === 'DDP') {
    if (!rule.ddp_included_in_rate) {
      if (rule.ddp_per_kg > 0) {
        ddpSurcharge = Math.max(rule.ddp_minimum, rule.ddp_per_kg * totalWeight); // Usually based on exact kg OR Ceil Kg. Let's use Ceil weight for DDP per kg unless stated otherwise, but standard is per kg chargeable weight (decimals included?). Actually PDF says "Rp 15.000 per Kg" meaning per chargeable kg. Total chargeable weight ceil usually used. We'll use totalWeightCeil.
        ddpSurcharge = Math.max(rule.ddp_minimum, rule.ddp_per_kg * totalWeightCeil);
      }
    }
  }

  let handlingSurcharge = 0;
  let applyHandlingSurcharge = false;
  
  if (rule.handling_surcharge > 0) {
    for (const pkg of packages) {
      let isOversize = false;
      const weight = pkg.weight || 0;
      const length = pkg.length || 0;
      const width = pkg.width || 0;
      const height = pkg.height || 0;
      
      let dimensions = [length, width, height].sort((a,b) => b-a);
      // Longest side is dimensions[0], the other two are W and H.
      // Girth calculation: (2 x W) + (2 x H). Longest side is length.
      // E.g. USA: (2x Panjang + 2x Lebar) - the terminology 'Panjang' here might mean 'sisi kedua terpanjang' or standard Girth = (2*W + 2*H). PDF says "Girth (2x Panjang + 2x Lebar)". In shipping, Girth is generally 2*Width + 2*Height, while Length is the longest side. We will assume Length + Girth = Length + 2*W + 2*H. Wait, PDF literally says "Girth (2x Panjang + 2x Lebar)". Let's use 2*dimensions[1] + 2*dimensions[2].
      const girth = (2 * dimensions[1]) + (2 * dimensions[2]);
      const p = dimensions[0]; // panjang (longest side)

      if (rule.handling_condition_weight_kg && weight > rule.handling_condition_weight_kg) {
        isOversize = true;
      }
      if (rule.handling_condition_length_cm && p > rule.handling_condition_length_cm) {
        isOversize = true;
      }
      if (rule.handling_condition_girth_cm && girth > rule.handling_condition_girth_cm) {
        isOversize = true;
      }

      if (isOversize) {
        applyHandlingSurcharge = true;
        break;
      }
    }
    
    if (applyHandlingSurcharge) {
      handlingSurcharge = rule.handling_surcharge; // max handling surcharge applied per shipment, not per package (PDF says "dikenakan Handling Surcharge xyz per pengiriman")
    }
  }

  const remoteAreaSurcharge = isRemoteArea ? (rule.remote_area_surcharge || 0) : 0;

  return {
    ddpSurcharge,
    handlingSurcharge,
    remoteAreaSurcharge
  };
}
