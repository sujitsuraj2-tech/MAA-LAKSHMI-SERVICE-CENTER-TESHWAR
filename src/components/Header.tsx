import {useState} from 'react';
import {Phone, MessageCircle, MapPin, User} from 'lucide-react';
import {
  CALL_LINK,
  CONTACT_NUMBER,
  DEVELOPER_CREDIT,
  OWNER_NAME,
  SHOP_ADDRESS,
  SHOP_NAME,
  WHATSAPP_LINK,
} from '../constants/workshop';

const HEADER_OWNER_PHOTO = '/assets/aistudio/image_8209a04d.png';

export default function Header() {
  const [photoErr, setPhotoErr] = useState(false);

  return (
    <header className="bg-[#052e16] text-white border-b border-emerald-800/70">
      {/* 1. Absolute Top: Developed by Sujit Razz */}
      <div className="bg-[#022c22] border-b border-emerald-900/80 py-2 px-4 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-emerald-200">
          {DEVELOPER_CREDIT}
        </p>
      </div>

      {/* 2–4: Shop Name -> Dhanjay Kumar -> Address -> 7634807282 + Owner Portrait + Call & WhatsApp Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Circular Owner Portrait fitted cleanly at the top */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-emerald-500 to-amber-300 shadow-lg shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-emerald-900 border-2 border-[#052e16] flex items-center justify-center">
                {!photoErr ? (
                  <img
                    src={HEADER_OWNER_PHOTO}
                    alt={`${OWNER_NAME} — ${SHOP_NAME}`}
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoErr(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <User className="w-9 h-9 text-emerald-200" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="flex flex-col items-start space-y-1.5 min-w-0">
              {/* 2. Shop Name */}
              <h1 className="font-display text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight text-balance">
                {SHOP_NAME}
              </h1>

              {/* 3. Directly below shop name: Dhanjay Kumar */}
              <p className="text-base sm:text-lg font-semibold text-amber-300 tracking-wide">
                {OWNER_NAME}
              </p>

              {/* Address directly below Dhanjay Kumar */}
              <p className="inline-flex items-start gap-1.5 text-xs sm:text-sm font-medium text-emerald-100">
                <MapPin className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
                <span>{SHOP_ADDRESS}</span>
              </p>

              {/* 4. Below that: 7634807282 */}
              <a
                href={CALL_LINK}
                className="font-mono-tabular inline-flex items-center gap-2 text-base sm:text-lg font-bold text-emerald-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded"
              >
                <Phone className="w-4 h-4 text-emerald-300 shrink-0" aria-hidden="true" />
                <span>{CONTACT_NUMBER}</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-8">
            <nav
              aria-label="Mukhya Navigation"
              className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-emerald-100"
            >
              <a
                href="#services"
                className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Sevayein
              </a>
              <a
                href="#workshop"
                className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Workshop
              </a>
              <a
                href="#contact"
                className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Sampark
              </a>
              <a
                href="#shop-owner"
                className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                Shop Owner
              </a>
              <a
                href="#qr-scanner"
                className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
              >
                QR Scanner
              </a>
            </nav>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={CALL_LINK}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-sm transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Call Karein</span>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-sm transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp Karein</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
