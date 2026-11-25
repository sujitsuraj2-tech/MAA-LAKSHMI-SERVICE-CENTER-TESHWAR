import {useState} from 'react';
import {Phone, MessageCircle, Wrench} from 'lucide-react';
import {CALL_LINK, WHATSAPP_LINK} from '../constants/workshop';

const HERO_IMAGE_PATH = '/assets/aistudio/image_4b95788c.png';

export default function Hero() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#064e3b] text-white">
      <div className="relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-center">
        {/* Background Workshop Photography with Measured Contrast Scrim */}
        {!imageError ? (
          <img
            src={HERO_IMAGE_PATH}
            alt="MAA LAKSHMI AUTO SERVICE CENTER workshop mein bike ki marammat karte mechanic"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 flex items-center justify-end pr-16 opacity-90">
            <Wrench className="w-40 h-40 text-emerald-700/40" aria-hidden="true" />
          </div>
        )}

        {/* Measured contrast scrim >= 4.5:1 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#042f2e]/95 via-[#064e3b]/85 to-[#064e3b]/45"
          aria-hidden="true"
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl space-y-5">
            <p className="text-xs sm:text-sm font-semibold tracking-wide text-amber-300">
              Bharosemand Two-Wheeler Workshop · Sabhi Brand aur Model
            </p>

            {/* Main Hero Headline kept in English */}
            <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
              Complete Bike Repairing &amp; Servicing Solution
            </h2>

            <p className="text-lg sm:text-2xl font-medium text-emerald-100 leading-relaxed">
              Aapki Bike, Hamari Zimmedari
            </p>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl leading-relaxed">
              Samanya servicing, engine repair aur fuel injection jaanch se lekar denting, painting
              aur ghar se pickup wa drop tak — har kaam poori savdhani aur uchit keemat par.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href={CALL_LINK}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base shadow-lg shadow-black/25 transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>Call Karein</span>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-black/25 transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4-column workshop assurance bar */}
      <div className="bg-[#022c22] border-t border-emerald-800/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          <div className="border-r border-emerald-800/60 pr-3 last:border-r-0">
            <p className="font-mono-tabular text-lg sm:text-xl font-bold text-amber-300">24</p>
            <p className="text-xs sm:text-sm text-emerald-100">Vishesh Bike Sevayein</p>
          </div>
          <div className="lg:border-r border-emerald-800/60 pr-3">
            <p className="font-mono-tabular text-lg sm:text-xl font-bold text-emerald-300">100%</p>
            <p className="text-xs sm:text-sm text-emerald-100">Asli Spare Parts</p>
          </div>
          <div className="border-r border-emerald-800/60 pr-3 lg:border-r">
            <p className="text-lg sm:text-xl font-bold text-sky-300">Usi Din</p>
            <p className="text-xs sm:text-sm text-emerald-100">Tez General Servicing</p>
          </div>
          <div>
            <p className="text-lg sm:text-xl font-bold text-orange-300">Home Service</p>
            <p className="text-xs sm:text-sm text-emerald-100">Pickup aur Drop Suvidha</p>
          </div>
        </div>
      </div>
    </section>
  );
}
