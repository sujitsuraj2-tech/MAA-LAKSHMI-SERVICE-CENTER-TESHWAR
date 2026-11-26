export type ServiceCategory =
  | 'all'
  | 'engine'
  | 'electrical'
  | 'chassis'
  | 'care';

export type ColorTone =
  | 'dark-green'
  | 'light-green'
  | 'yellow'
  | 'orange'
  | 'blue'
  | 'purple';

export type ServiceIconName =
  | 'wrench'
  | 'cog'
  | 'droplet'
  | 'sparkles'
  | 'disc'
  | 'layers'
  | 'settings'
  | 'link'
  | 'battery'
  | 'circle-dot'
  | 'shield-alert'
  | 'zap'
  | 'lightbulb'
  | 'power'
  | 'rotate-cw'
  | 'filter'
  | 'fuel'
  | 'wind'
  | 'flame'
  | 'activity'
  | 'git-fork'
  | 'compass'
  | 'paintbrush'
  | 'truck';

export interface BikeService {
  id: number;
  name: string;
  description: string;
  category: Exclude<ServiceCategory, 'all'>;
  tone: ColorTone;
  icon: ServiceIconName;
  imageUrl: string;
}

export const SERVICE_CATEGORIES: ReadonlyArray<{id: ServiceCategory; label: string}> = [
  {id: 'all', label: 'Sabhi 24 Sevayein'},
  {id: 'engine', label: 'Engine aur Fuel'},
  {id: 'electrical', label: 'Electrical aur Start'},
  {id: 'chassis', label: 'Brake, Tyre aur Suspension'},
  {id: 'care', label: 'Wash, Paint aur Pickup'},
];

export const TONE_STYLES: Record<
  ColorTone,
  {
    fallbackBg: string;
    cardBorder: string;
    iconBg: string;
    numberText: string;
    ctaText: string;
  }
> = {
  'dark-green': {
    fallbackBg: 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900',
    cardBorder: 'border-emerald-700/70 hover:border-emerald-400',
    iconBg: 'bg-emerald-700 text-white shadow-emerald-950/40 ring-1 ring-white/25',
    numberText: 'text-emerald-200',
    ctaText: 'text-emerald-300 group-hover:text-emerald-200',
  },
  'light-green': {
    fallbackBg: 'bg-gradient-to-br from-green-950 via-green-900 to-slate-900',
    cardBorder: 'border-green-600/70 hover:border-green-400',
    iconBg: 'bg-green-600 text-white shadow-green-950/40 ring-1 ring-white/25',
    numberText: 'text-green-200',
    ctaText: 'text-green-300 group-hover:text-green-200',
  },
  yellow: {
    fallbackBg: 'bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900',
    cardBorder: 'border-amber-500/70 hover:border-amber-300',
    iconBg: 'bg-amber-400 text-slate-950 shadow-amber-950/40 ring-1 ring-white/35',
    numberText: 'text-amber-200',
    ctaText: 'text-amber-300 group-hover:text-amber-200',
  },
  orange: {
    fallbackBg: 'bg-gradient-to-br from-orange-950 via-orange-900 to-slate-900',
    cardBorder: 'border-orange-500/70 hover:border-orange-300',
    iconBg: 'bg-orange-600 text-white shadow-orange-950/40 ring-1 ring-white/25',
    numberText: 'text-orange-200',
    ctaText: 'text-orange-300 group-hover:text-orange-200',
  },
  blue: {
    fallbackBg: 'bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900',
    cardBorder: 'border-blue-500/70 hover:border-blue-300',
    iconBg: 'bg-blue-600 text-white shadow-blue-950/40 ring-1 ring-white/25',
    numberText: 'text-sky-200',
    ctaText: 'text-sky-300 group-hover:text-sky-200',
  },
  purple: {
    fallbackBg: 'bg-gradient-to-br from-violet-950 via-violet-900 to-slate-900',
    cardBorder: 'border-violet-500/70 hover:border-violet-300',
    iconBg: 'bg-violet-600 text-white shadow-violet-950/40 ring-1 ring-white/25',
    numberText: 'text-violet-200',
    ctaText: 'text-violet-300 group-hover:text-violet-200',
  },
};

export const BIKE_SERVICES: ReadonlyArray<BikeService> = [
  {
    id: 1,
    name: 'General Bike Servicing',
    description: 'Poori bike ki jaanch, tuning, oiling aur suraksha checkup.',
    category: 'care',
    tone: 'dark-green',
    icon: 'wrench',
    imageUrl: '/src/assets/images/hero_bike_workshop_1795622679692.jpg',
  },
  {
    id: 2,
    name: 'Engine Repair',
    description: 'Poora engine overhaul, piston kaam, valve timing aur aawaz ki jaanch.',
    category: 'engine',
    tone: 'orange',
    icon: 'cog',
    imageUrl: '/src/assets/images/workshop_engine_service_1795622679690.jpg',
  },
  {
    id: 3,
    name: 'Engine Oil Change',
    description: 'Asli mineral ya synthetic engine oil badalna aur filter jaanch.',
    category: 'engine',
    tone: 'yellow',
    icon: 'droplet',
    imageUrl: '/src/assets/images/svc_engine_oil_change_1795629633376.jpg',
  },
  {
    id: 4,
    name: 'Bike Washing',
    description: 'High-pressure foam wash, chain safai aur chamakdar polish finish.',
    category: 'care',
    tone: 'blue',
    icon: 'sparkles',
    imageUrl: '/src/assets/images/workshop_wash_detailing_1795622680695.jpg',
  },
  {
    id: 5,
    name: 'Brake Repair',
    description: 'Disc pad badalna, drum shoe setting aur brake oil bleeding.',
    category: 'chassis',
    tone: 'orange',
    icon: 'disc',
    imageUrl: '/src/assets/images/svc_brake_repair_1795629633752.jpg',
  },
  {
    id: 6,
    name: 'Clutch Repair',
    description: 'Clutch plate badalna, cable setting aur smooth gear shifting.',
    category: 'engine',
    tone: 'purple',
    icon: 'layers',
    imageUrl: '/src/assets/images/svc_clutch_repair_1795629634631.jpg',
  },
  {
    id: 7,
    name: 'Gearbox Repair',
    description: 'Gearbox jaanch, shaft alignment aur oil seal marammat.',
    category: 'engine',
    tone: 'dark-green',
    icon: 'settings',
    imageUrl: '/src/assets/images/svc_gearbox_repair_1795629634608.jpg',
  },
  {
    id: 8,
    name: 'Chain Sprocket Repair',
    description: 'Chain tight karna, lubrication aur poora sprocket kit badalna.',
    category: 'chassis',
    tone: 'light-green',
    icon: 'link',
    imageUrl: '/src/assets/images/svc_chain_sprocket_1795629635430.jpg',
  },
  {
    id: 9,
    name: 'Battery Replacement',
    description: 'Voltage jaanch, terminal safai aur nayi asli battery fitting.',
    category: 'electrical',
    tone: 'yellow',
    icon: 'battery',
    imageUrl: '/src/assets/images/svc_battery_service_1795629635571.jpg',
  },
  {
    id: 10,
    name: 'Tyre Replacement',
    description: 'Tubeless aur tube tyre fitting, valve check aur rim jaanch.',
    category: 'chassis',
    tone: 'blue',
    icon: 'circle-dot',
    imageUrl: '/src/assets/images/svc_tyre_replacement_1795629636388.jpg',
  },
  {
    id: 11,
    name: 'Puncture Repair',
    description: 'Majboot mushroom plug aur tube patch se turant puncture marammat.',
    category: 'chassis',
    tone: 'orange',
    icon: 'shield-alert',
    imageUrl: '/src/assets/images/svc_puncture_repair_1795629636566.jpg',
  },
  {
    id: 12,
    name: 'Electrical Repair',
    description: 'Wiring jaanch, fuse box, horn aur indicator ki marammat.',
    category: 'electrical',
    tone: 'purple',
    icon: 'zap',
    imageUrl: '/src/assets/images/svc_electrical_repair_1795629637654.jpg',
  },
  {
    id: 13,
    name: 'Headlight Repair',
    description: 'LED aur halogen bulb upgrade, focus setting aur switch sudhar.',
    category: 'electrical',
    tone: 'yellow',
    icon: 'lightbulb',
    imageUrl: '/src/assets/images/svc_headlight_repair_1795629638526.jpg',
  },
  {
    id: 14,
    name: 'Self Start Repair',
    description: 'Self motor carbon brush, relay aur bendix gear servicing.',
    category: 'electrical',
    tone: 'light-green',
    icon: 'power',
    imageUrl: '/src/assets/images/svc_self_start_1795629638716.jpg',
  },
  {
    id: 15,
    name: 'Kick Start Repair',
    description: 'Kick ratchet, spring aur gear shaft ki pakki marammat.',
    category: 'engine',
    tone: 'dark-green',
    icon: 'rotate-cw',
    imageUrl: '/src/assets/images/svc_kick_start_1795629638696.jpg',
  },
  {
    id: 16,
    name: 'Carburetor Cleaning',
    description: 'Carburetor jet ki poori safai, tuning aur behtar mileage setting.',
    category: 'engine',
    tone: 'blue',
    icon: 'filter',
    imageUrl: '/src/assets/images/svc_carburetor_cleaning_1795629744803.jpg',
  },
  {
    id: 17,
    name: 'Fuel Injection Service',
    description: 'FI injector cleaning, throttle body setting aur sensor jaanch.',
    category: 'engine',
    tone: 'purple',
    icon: 'fuel',
    imageUrl: '/src/assets/images/svc_fuel_injection_1795629727442.jpg',
  },
  {
    id: 18,
    name: 'Air Filter Cleaning',
    description: 'Saaf hawa aur behtar pickup ke liye air filter safai aur badlav.',
    category: 'engine',
    tone: 'light-green',
    icon: 'wind',
    imageUrl: '/src/assets/images/svc_air_filter_1795629745505.jpg',
  },
  {
    id: 19,
    name: 'Spark Plug Replacement',
    description: 'Spark gap jaanch, carbon safai aur naya spark plug fitment.',
    category: 'electrical',
    tone: 'orange',
    icon: 'flame',
    imageUrl: '/src/assets/images/svc_spark_plug_1795629726601.jpg',
  },
  {
    id: 20,
    name: 'Suspension Repair',
    description: 'Rear shock absorber setting, bush badlav aur aaramdayak sawari.',
    category: 'chassis',
    tone: 'blue',
    icon: 'activity',
    imageUrl: '/src/assets/images/svc_suspension_repair_1795629745076.jpg',
  },
  {
    id: 21,
    name: 'Front Fork Repair',
    description: 'Front shocker oil seal badalna, seedha karna aur oil refill.',
    category: 'chassis',
    tone: 'dark-green',
    icon: 'git-fork',
    imageUrl: '/src/assets/images/svc_front_fork_1795629744995.jpg',
  },
  {
    id: 22,
    name: 'Wheel Alignment',
    description: 'Wheel balancing, rim setting aur bina kampan ki steering.',
    category: 'chassis',
    tone: 'purple',
    icon: 'compass',
    imageUrl: '/src/assets/images/svc_wheel_alignment_1795629746850.jpg',
  },
  {
    id: 23,
    name: 'Bike Denting and Painting',
    description: 'Kharoch hatana, tank denting aur shandar showroom jaisi painting.',
    category: 'care',
    tone: 'yellow',
    icon: 'paintbrush',
    imageUrl: '/src/assets/images/svc_denting_painting_1795629642633.jpg',
  },
  {
    id: 24,
    name: 'Bike Pickup and Drop Service',
    description: 'Ghar se bike pickup aur service ke baad surakshit delivery suvidha.',
    category: 'care',
    tone: 'light-green',
    icon: 'truck',
    imageUrl: '/src/assets/images/svc_pickup_drop_1795629727024.jpg',
  },
];
