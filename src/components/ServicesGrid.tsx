import {useState} from 'react';
import {
  Activity,
  BatteryCharging,
  CircleDot,
  Cog,
  Compass,
  Disc,
  Droplet,
  Filter,
  Flame,
  Fuel,
  GitFork,
  Layers,
  Lightbulb,
  Link as LinkIcon,
  MessageCircle,
  Paintbrush,
  Power,
  RotateCw,
  Settings,
  ShieldAlert,
  Sparkles,
  Truck,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  BIKE_SERVICES,
  SERVICE_CATEGORIES,
  TONE_STYLES,
  type BikeService,
  type ServiceCategory,
  type ServiceIconName,
} from '../constants/services';
import {buildWhatsAppUrl} from '../constants/workshop';

function ServiceIcon({name, className}: {name: ServiceIconName; className?: string}) {
  switch (name) {
    case 'wrench':
      return <Wrench className={className} aria-hidden="true" />;
    case 'cog':
      return <Cog className={className} aria-hidden="true" />;
    case 'droplet':
      return <Droplet className={className} aria-hidden="true" />;
    case 'sparkles':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'disc':
      return <Disc className={className} aria-hidden="true" />;
    case 'layers':
      return <Layers className={className} aria-hidden="true" />;
    case 'settings':
      return <Settings className={className} aria-hidden="true" />;
    case 'link':
      return <LinkIcon className={className} aria-hidden="true" />;
    case 'battery':
      return <BatteryCharging className={className} aria-hidden="true" />;
    case 'circle-dot':
      return <CircleDot className={className} aria-hidden="true" />;
    case 'shield-alert':
      return <ShieldAlert className={className} aria-hidden="true" />;
    case 'zap':
      return <Zap className={className} aria-hidden="true" />;
    case 'lightbulb':
      return <Lightbulb className={className} aria-hidden="true" />;
    case 'power':
      return <Power className={className} aria-hidden="true" />;
    case 'rotate-cw':
      return <RotateCw className={className} aria-hidden="true" />;
    case 'filter':
      return <Filter className={className} aria-hidden="true" />;
    case 'fuel':
      return <Fuel className={className} aria-hidden="true" />;
    case 'wind':
      return <Wind className={className} aria-hidden="true" />;
    case 'flame':
      return <Flame className={className} aria-hidden="true" />;
    case 'activity':
      return <Activity className={className} aria-hidden="true" />;
    case 'git-fork':
      return <GitFork className={className} aria-hidden="true" />;
    case 'compass':
      return <Compass className={className} aria-hidden="true" />;
    case 'paintbrush':
      return <Paintbrush className={className} aria-hidden="true" />;
    case 'truck':
      return <Truck className={className} aria-hidden="true" />;
  }
}

function ServiceSquareCard({service}: {service: BikeService}) {
  const [imgFailed, setImgFailed] = useState(false);
  const tone = TONE_STYLES[service.tone];
  const whatsappServiceUrl = buildWhatsAppUrl(
    `Namaste Dhanjay Kumar ji, mujhe MAA LAKSHMI AUTO SERVICE CENTER par "${service.name}" seva chahiye. Kripya samay aur kharch batayein.`,
  );

  return (
    <a
      href={whatsappServiceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${service.name} — WhatsApp par Book Karein`}
      className={`group relative aspect-square rounded-2xl border-2 ${tone.fallbackBg} ${tone.cardBorder} p-3.5 sm:p-5 shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700`}
    >
      {/* Background photograph specific to this service */}
      {!imgFailed && (
        <img
          src={service.imageUrl}
          alt={service.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      )}

      {/* Measured contrast scrim so foreground logo, title, and Hinglish copy stay sharp */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/65 to-slate-950/35 transition-opacity duration-200 group-hover:from-slate-950/90 group-hover:via-slate-950/55"
      />

      {/* Top row: Service Logo/Icon & Index */}
      <div className="relative z-10 flex items-start justify-between gap-2">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${tone.iconBg} shadow-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
        >
          <ServiceIcon name={service.icon} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <span
          className={`font-mono-tabular text-xs sm:text-sm font-bold drop-shadow ${tone.numberText}`}
        >
          {String(service.id).padStart(2, '0')}
        </span>
      </div>

      {/* Middle & Bottom: Service Name (English) + Hinglish Description + Book CTA */}
      <div className="relative z-10 mt-auto space-y-1.5 sm:space-y-2 pt-3">
        <div className="space-y-1">
          <h3 className="font-display text-sm sm:text-lg font-bold text-white leading-snug line-clamp-2 drop-shadow-sm">
            {service.name}
          </h3>
          <p className="text-[11px] sm:text-sm text-slate-200 leading-snug line-clamp-2 sm:line-clamp-3">
            {service.description}
          </p>
        </div>

        <div
          className={`pt-1 flex items-center justify-between text-[11px] sm:text-xs font-semibold ${tone.ctaText}`}
        >
          <span>WhatsApp par Book Karein</span>
          <MessageCircle
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  );
}

export default function ServicesGrid() {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');

  const filteredServices =
    selectedCategory === 'all'
      ? BIKE_SERVICES
      : BIKE_SERVICES.filter((service) => service.category === selectedCategory);

  return (
    <section id="services" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 sm:mb-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
              Sampoorn Two-Wheeler Dekhbhal
            </p>
            {/* Main Section Heading kept in English */}
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
              Our Bike Repairing &amp; Servicing Expertise
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Har seva aadhunik auzaron, asli spare parts aur sahi anuman ke saath ki jaati hai.
              Seedhe WhatsApp par booking ke liye kisi bhi seva card par click karein.
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="tablist"
            aria-label="Bike sevaon ko shreni ke anusar chunein"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-emerald-50 border border-emerald-200/80 rounded-xl"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const active = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 ${
                    active
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-emerald-900 hover:bg-emerald-100/80'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Square Card Grid: 2 columns on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredServices.map((service) => (
            <ServiceSquareCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
