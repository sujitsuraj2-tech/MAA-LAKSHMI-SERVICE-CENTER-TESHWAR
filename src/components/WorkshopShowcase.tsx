import {useState} from 'react';
import {CheckCircle2, Sparkles, Wrench} from 'lucide-react';

const ENGINE_IMAGE = '/assets/aistudio/image_4b95788c.png';
const WASH_IMAGE = '/assets/aistudio/image_92f82f3a.png';

export default function WorkshopShowcase() {
  const [engineImgErr, setEngineImgErr] = useState(false);
  const [washImgErr, setWashImgErr] = useState(false);

  return (
    <section
      id="workshop"
      className="py-14 sm:py-20 bg-gradient-to-b from-emerald-50/70 to-white border-y border-emerald-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-emerald-700">
            Hamare Workshop ki Khasiyat
          </p>
          {/* Main Section Heading kept in English */}
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Precision Mechanical Care &amp; Clean Finish
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Delivery se pehle har two-wheeler ki sateek engine jaanch, sahi tuning aur behtareen
            foam wash dekhbhal ki jaati hai.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Engine & Mechanical Bay */}
          <article className="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-[4/3] w-full overflow-hidden bg-emerald-950 relative">
              {!engineImgErr ? (
                <img
                  src={ENGINE_IMAGE}
                  alt="MAA LAKSHMI AUTO SERVICE CENTER mein bike repairing karte mechanic"
                  referrerPolicy="no-referrer"
                  onError={() => setEngineImgErr(true)}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-700 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Wrench className="w-12 h-12 text-amber-300 mb-3" aria-hidden="true" />
                  <p className="font-display text-lg font-bold">Precision Engine &amp; Gearbox Bay</p>
                </div>
              )}
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Card Heading kept in English */}
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Engine Overhaul &amp; Fuel System Tuning
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Carburetor ki safai aur spark plug setting se lekar poore engine rebuild aur
                  fuel-injection tuning tak, hum behtareen pickup aur mileage wapas laate hain.
                </p>
              </div>
              <ul className="pt-2 space-y-1.5 text-sm text-emerald-900 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Asli engine oil aur air filter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Clutch, gearbox aur chain sprocket ki sateek setting</span>
                </li>
              </ul>
            </div>
          </article>

          {/* Card 2: Foam Wash, Detailing & Pickup Bay */}
          <article className="bg-white rounded-2xl border border-emerald-200/80 overflow-hidden shadow-sm flex flex-col">
            <div className="aspect-[4/3] w-full overflow-hidden bg-emerald-950 relative">
              {!washImgErr ? (
                <img
                  src={WASH_IMAGE}
                  alt="MAA LAKSHMI AUTO SERVICE CENTER workshop aur spare parts bay"
                  referrerPolicy="no-referrer"
                  onError={() => setWashImgErr(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-teal-700 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Sparkles className="w-12 h-12 text-sky-300 mb-3" aria-hidden="true" />
                  <p className="font-display text-lg font-bold">Foam Wash &amp; Denting Paint Care</p>
                </div>
              )}
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Card Heading kept in English */}
                <h3 className="font-display text-xl font-bold text-slate-900">
                  Foam Wash, Denting Painting &amp; Doorstep Pickup
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Paint-surakshit high-pressure foam wash, kharoch wa dent sudhar, aur suvidhajanak
                  doorstep bike pickup wa drop seva taaki aapka samay bach sake.
                </p>
              </div>
              <ul className="pt-2 space-y-1.5 text-sm text-emerald-900 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Paint-surakshit foam wash aur chain lubrication</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Aaspaas ke kshetron mein ghar se pickup aur drop suvidha</span>
                </li>
              </ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
