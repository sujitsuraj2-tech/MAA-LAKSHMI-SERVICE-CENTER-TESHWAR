export const SERVICE_CATEGORIES = [
  {id: 'all', label: 'All Services'},
  {id: 'maintenance', label: 'Maintenance'},
  {id: 'engine', label: 'Engine & Drive'},
  {id: 'electrical', label: 'Electrical'},
  {id: 'wheels', label: 'Wheels & Brakes'},
  {id: 'care', label: 'Bike Care'},
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number]['id'];

export const TONE_STYLES = {
  emerald: {
    fallbackBg: 'bg-emerald-950',
    cardBorder: 'border-emerald-700',
    iconBg: 'bg-emerald-500 text-slate-950',
    numberText: 'text-emerald-200',
    ctaText: 'text-emerald-200',
  },
  amber: {
    fallbackBg: 'bg-amber-950',
    cardBorder: 'border-amber-700',
    iconBg: 'bg-amber-400 text-slate-950',
    numberText: 'text-amber-200',
    ctaText: 'text-amber-200',
  },
  sky: {
    fallbackBg: 'bg-sky-950',
    cardBorder: 'border-sky-700',
    iconBg: 'bg-sky-400 text-slate-950',
    numberText: 'text-sky-200',
    ctaText: 'text-sky-200',
  },
  rose: {
    fallbackBg: 'bg-rose-950',
    cardBorder: 'border-rose-700',
    iconBg: 'bg-rose-400 text-slate-950',
    numberText: 'text-rose-200',
    ctaText: 'text-rose-200',
  },
} as const;

export type ServiceIconName =
  | 'wrench' | 'cog' | 'droplet' | 'sparkles' | 'disc' | 'layers'
  | 'settings' | 'link' | 'battery' | 'circle-dot' | 'shield-alert' | 'zap'
  | 'lightbulb' | 'power' | 'rotate-cw' | 'filter' | 'fuel' | 'wind'
  | 'flame' | 'activity' | 'git-fork' | 'compass' | 'paintbrush' | 'truck';

export interface BikeService {
  id: number;
  name: string;
  description: string;
  category: Exclude<ServiceCategory, 'all'>;
  icon: ServiceIconName;
  tone: keyof typeof TONE_STYLES;
  imageUrl: string;
}

function serviceImage(filename: string): string {
  return `/src/assets/images/${filename}`;
}

export const BIKE_SERVICES: readonly BikeService[] = [
  {
    id: 1, name: 'Complete Bike Servicing', category: 'maintenance', icon: 'wrench', tone: 'emerald',
    description: 'Oil, brakes, chain aur doosre zaroori parts ki poori jaanch aur servicing.',
    imageUrl: serviceImage('hero_bike_workshop_1795622679692.jpg'),
  },
  {
    id: 2, name: 'Engine Repair', category: 'engine', icon: 'cog', tone: 'amber',
    description: 'Engine ki awaaz, vibration aur power loss ki jaanch aur marammat.',
    imageUrl: serviceImage('workshop_engine_service_1795622679690.jpg'),
  },
  {
    id: 3, name: 'Engine Oil Change', category: 'maintenance', icon: 'droplet', tone: 'emerald',
    description: 'Purana engine oil nikal kar bike ke liye sahi grade ka naya oil daalte hain.',
    imageUrl: serviceImage('svc_engine_oil_change_1795629633376.jpg'),
  },
  {
    id: 4, name: 'Foam Wash & Detailing', category: 'care', icon: 'sparkles', tone: 'sky',
    description: 'Foam wash se dhool aur mail hata kar bike ki safai aur detailing.',
    imageUrl: serviceImage('workshop_wash_detailing_1795622680695.jpg'),
  },
  {
    id: 5, name: 'Brake Repair', category: 'wheels', icon: 'disc', tone: 'rose',
    description: 'Brake pads, shoes aur discs ki jaanch, adjustment aur zaroorat par badlaav.',
    imageUrl: serviceImage('svc_brake_repair_1795629633752.jpg'),
  },
  {
    id: 6, name: 'Clutch Repair', category: 'engine', icon: 'layers', tone: 'amber',
    description: 'Clutch slip, hard lever aur cable ki dikkat ki jaanch aur marammat.',
    imageUrl: serviceImage('svc_clutch_repair_1795629634631.jpg'),
  },
  {
    id: 7, name: 'Gearbox Repair', category: 'engine', icon: 'settings', tone: 'amber',
    description: 'Gear badalne mein dikkat, gear slip ya gearbox ki awaaz ki jaanch.',
    imageUrl: serviceImage('svc_gearbox_repair_1795629634608.jpg'),
  },
  {
    id: 8, name: 'Chain & Sprocket Service', category: 'engine', icon: 'link', tone: 'amber',
    description: 'Chain ki safai, lubrication aur tension setting; ghise parts ka badlaav.',
    imageUrl: serviceImage('svc_chain_sprocket_1795629635430.jpg'),
  },
  {
    id: 9, name: 'Battery Service', category: 'electrical', icon: 'battery', tone: 'sky',
    description: 'Battery charge aur terminals ki jaanch; zaroorat par battery badalte hain.',
    imageUrl: serviceImage('svc_battery_service_1795629635571.jpg'),
  },
  {
    id: 10, name: 'Tyre Replacement', category: 'wheels', icon: 'circle-dot', tone: 'rose',
    description: 'Ghise ya damage hue tyre ko bike ke sahi size ke tyre se badalte hain.',
    imageUrl: serviceImage('svc_tyre_replacement_1795629636388.jpg'),
  },
  {
    id: 11, name: 'Puncture Repair', category: 'wheels', icon: 'shield-alert', tone: 'rose',
    description: 'Tube aur tubeless tyre se hawa leak hone ki jagah dhoondh kar puncture theek karte hain.',
    imageUrl: serviceImage('svc_puncture_repair_1795629636566.jpg'),
  },
  {
    id: 12, name: 'Electrical Repair', category: 'electrical', icon: 'zap', tone: 'sky',
    description: 'Wiring, fuse, horn aur charging system ki dikkat ki jaanch aur marammat.',
    imageUrl: serviceImage('svc_electrical_repair_1795629637654.jpg'),
  },
  {
    id: 13, name: 'Headlight Repair', category: 'electrical', icon: 'lightbulb', tone: 'sky',
    description: 'Kam roshni ya band headlight ke bulb, switch aur wiring ki jaanch.',
    imageUrl: serviceImage('svc_headlight_repair_1795629638526.jpg'),
  },
  {
    id: 14, name: 'Self-Start Repair', category: 'electrical', icon: 'power', tone: 'sky',
    description: 'Self-start button, relay aur starter motor ki dikkat ki jaanch.',
    imageUrl: serviceImage('svc_self_start_1795629638716.jpg'),
  },
  {
    id: 15, name: 'Kick-Start Repair', category: 'engine', icon: 'rotate-cw', tone: 'amber',
    description: 'Kick lever, spring aur mechanism ki jaanch aur marammat.',
    imageUrl: serviceImage('svc_kick_start_1795629638696.jpg'),
  },
  {
    id: 16, name: 'Air Filter Service', category: 'maintenance', icon: 'filter', tone: 'emerald',
    description: 'Air filter ki haalat dekh kar safai ya badlaav karte hain.',
    imageUrl: serviceImage('svc_air_filter_1795629745505.jpg'),
  },
  {
    id: 17, name: 'Fuel Injection Service', category: 'engine', icon: 'fuel', tone: 'amber',
    description: 'Fuel injector aur supply ki jaanch, taaki bike sahi chale.',
    imageUrl: serviceImage('svc_fuel_injection_1795629727442.jpg'),
  },
  {
    id: 18, name: 'Carburetor Cleaning', category: 'engine', icon: 'wind', tone: 'amber',
    description: 'Carburetor aur jets ki safai, saath hi idle ki setting.',
    imageUrl: serviceImage('svc_carburetor_cleaning_1795629744803.jpg'),
  },
  {
    id: 19, name: 'Spark Plug Service', category: 'maintenance', icon: 'flame', tone: 'emerald',
    description: 'Spark plug ki condition aur gap ki jaanch; ghisa plug badalte hain.',
    imageUrl: serviceImage('svc_spark_plug_1795629726601.jpg'),
  },
  {
    id: 20, name: 'Suspension Repair', category: 'wheels', icon: 'activity', tone: 'rose',
    description: 'Jhatke, awaaz ya leakage ke liye suspension aur shock absorbers ki jaanch.',
    imageUrl: serviceImage('svc_suspension_repair_1795629745076.jpg'),
  },
  {
    id: 21, name: 'Front Fork Repair', category: 'wheels', icon: 'git-fork', tone: 'rose',
    description: 'Front fork mein oil leakage ya sakhti ki jaanch aur seal ki marammat.',
    imageUrl: serviceImage('svc_front_fork_1795629744995.jpg'),
  },
  {
    id: 22, name: 'Wheel Alignment', category: 'wheels', icon: 'compass', tone: 'rose',
    description: 'Bike ek taraf kheenchti hai to wheel alignment aur fitting ki jaanch.',
    imageUrl: serviceImage('svc_wheel_alignment_1795629746850.jpg'),
  },
  {
    id: 23, name: 'Denting & Painting', category: 'care', icon: 'paintbrush', tone: 'sky',
    description: 'Body panels ke dents aur scratches ki marammat aur paint touch-up.',
    imageUrl: serviceImage('svc_denting_painting_1795629642633.jpg'),
  },
  {
    id: 24, name: 'Pickup & Drop', category: 'care', icon: 'truck', tone: 'sky',
    description: 'Bike pickup aur service ke baad drop ka samay phone ya WhatsApp par tay karein.',
    imageUrl: serviceImage('svc_pickup_drop_1795629727024.jpg'),
  },
];
