import {
  CONTACT_NUMBER,
  DEVELOPER_CREDIT,
  OWNER_NAME,
  SHOP_ADDRESS,
  SHOP_NAME,
} from '../constants/workshop';

export default function Footer() {
  return (
    <footer className="bg-[#052e16] text-emerald-100 border-t border-emerald-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center space-y-2.5">
        <p className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-white">
          {SHOP_NAME}
        </p>
        <p className="text-base font-semibold text-amber-300">{OWNER_NAME}</p>
        <p className="text-sm text-emerald-100 font-medium">{SHOP_ADDRESS}</p>
        <p className="text-sm text-emerald-200">
          Bike Repairing | Servicing | Maintenance
        </p>
        <p className="font-mono-tabular text-sm sm:text-base font-bold text-white">
          Sampark: {CONTACT_NUMBER}
        </p>
        <div className="pt-4 mt-4 border-t border-emerald-800/70">
          <p className="text-xs sm:text-sm font-semibold text-emerald-200">
            {DEVELOPER_CREDIT}
          </p>
        </div>
      </div>
    </footer>
  );
}
