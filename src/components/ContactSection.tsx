import {useState, type FormEvent} from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  User,
  Building2,
  CalendarCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  buildWhatsAppUrl,
  CALL_LINK,
  CONTACT_NUMBER,
  OWNER_NAME,
  SHOP_ADDRESS,
  SHOP_NAME,
  WHATSAPP_LINK,
} from '../constants/workshop';
import {BIKE_SERVICES} from '../constants/services';

interface ConfirmedBooking {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  serviceName: string;
  preferredDate: string;
  pickupNeeded: boolean;
  notes: string;
}

export default function ContactSection() {
  const todayDate = new Date().toISOString().slice(0, 10);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [selectedService, setSelectedService] = useState(BIKE_SERVICES[0].name);
  const [preferredDate, setPreferredDate] = useState(todayDate);
  const [pickupNeeded, setPickupNeeded] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  async function handleBookingSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = customerName.trim();
    const cleanedPhone = customerPhone.replace(/\D/g, '');
    const trimmedBike = bikeModel.trim();

    if (trimmedName.length < 2) {
      setFormError('Kripya apna naam likhein (kam se kam 2 akshar).');
      return;
    }
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setFormError('Kripya 10 ankon ka sahi mobile number darj karein.');
      return;
    }
    if (!trimmedBike) {
      setFormError('Kripya apni bike ya scooter ka model likhein.');
      return;
    }

    setFormError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          customerName: trimmedName,
          customerPhone: cleanedPhone,
          bikeModel: trimmedBike,
          serviceName: selectedService,
          preferredDate,
          pickupNeeded,
          notes: notes.trim(),
        }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        booking?: ConfirmedBooking;
        error?: string;
      };

      if (!response.ok || !data.ok || !data.booking) {
        setFormError(data.error ?? 'Booking save nahi ho saki. Kripya dobara koshish karein.');
        return;
      }

      setConfirmedBooking(data.booking);
    } catch {
      setFormError('Server se sampark nahi ho paya. Kripya internet check karke dobara koshish karein.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleResetBooking() {
    setConfirmedBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setBikeModel('');
    setSelectedService(BIKE_SERVICES[0].name);
    setPreferredDate(todayDate);
    setPickupNeeded(false);
    setNotes('');
    setFormError(null);
  }

  const confirmedWhatsAppUrl = confirmedBooking
    ? buildWhatsAppUrl(
        [
          `Namaste ${OWNER_NAME} ji, maine ${SHOP_NAME} par direct service book ki hai.`,
          `Booking ID: ${confirmedBooking.referenceCode}`,
          `Naam: ${confirmedBooking.customerName}`,
          `Mobile: ${confirmedBooking.customerPhone}`,
          `Bike / Scooter: ${confirmedBooking.bikeModel}`,
          `Seva: ${confirmedBooking.serviceName}`,
          `Tarikh: ${confirmedBooking.preferredDate}`,
          `Pickup & Drop: ${confirmedBooking.pickupNeeded ? 'Haan' : 'Nahi'}`,
          ...(confirmedBooking.notes ? [`Vivaran: ${confirmedBooking.notes}`] : []),
        ].join('\n'),
      )
    : WHATSAPP_LINK;

  return (
    <section id="contact" className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 space-y-2">
          <p className="text-xs sm:text-sm font-semibold text-emerald-700">
            Humse Judein
          </p>
          {/* Main Section Heading kept in English */}
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
            Contact Us
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Turant bike servicing, raaste mein kharabi ki madad, spare parts ki jaankari ya home
            pickup ke liye seedhe sampark karein.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Direct Shop Contact Card */}
          <div className="lg:col-span-6 bg-[#064e3b] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-300">Workshop Vivaran</p>
                {/* Card Heading kept in English */}
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {SHOP_NAME}
                </h3>
              </div>

              <dl className="space-y-4 text-sm sm:text-base">
                <div className="flex items-start gap-3.5">
                  <Building2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-emerald-200 font-medium">Dukaan ka Naam</dt>
                    <dd className="font-bold text-white">{SHOP_NAME}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <User className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-emerald-200 font-medium">Naam</dt>
                    <dd className="font-bold text-amber-200">{OWNER_NAME}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-emerald-200 font-medium">Mobile</dt>
                    <dd>
                      <a
                        href={CALL_LINK}
                        className="font-mono-tabular text-lg font-bold text-white hover:text-amber-300 transition-colors"
                      >
                        {CONTACT_NUMBER}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-orange-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-emerald-200 font-medium">Khulne ka Samay</dt>
                    <dd className="text-emerald-50 font-medium">
                      Somwar – Raviwar · Subah 8:00 baje se Raat 8:30 baje tak
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-violet-300 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-xs text-emerald-200 font-medium">Pata (Address)</dt>
                    <dd className="text-emerald-50 font-medium">
                      {SHOP_ADDRESS}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href={CALL_LINK}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-sm transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Call Karein</span>
              </a>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base shadow-sm transition-transform duration-150 hover:-translate-y-0.5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>WhatsApp Karein</span>
              </a>
            </div>
          </div>

          {/* Direct Backend Service Booking Card */}
          <div className="lg:col-span-6 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            {confirmedBooking ? (
              <div className="space-y-6 my-auto">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    {/* Confirmation Heading kept in English */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                      Service Booking Confirmed
                    </h3>
                    <p className="text-sm text-emerald-900 font-medium">
                      Aapki booking hamare backend system mein save ho chuki hai.
                    </p>
                  </div>
                </div>

                <dl className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-5 space-y-2.5 text-sm">
                  <div className="flex justify-between gap-4 border-b border-emerald-100 pb-2">
                    <dt className="text-slate-500 font-medium">Booking ID</dt>
                    <dd className="font-mono-tabular font-bold text-emerald-800">
                      {confirmedBooking.referenceCode}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Naam</dt>
                    <dd className="font-semibold text-slate-900 text-right">
                      {confirmedBooking.customerName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Mobile</dt>
                    <dd className="font-mono-tabular font-semibold text-slate-900">
                      {confirmedBooking.customerPhone}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Bike Model</dt>
                    <dd className="font-semibold text-slate-900 text-right">
                      {confirmedBooking.bikeModel}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Seva</dt>
                    <dd className="font-semibold text-slate-900 text-right">
                      {confirmedBooking.serviceName}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Tarikh</dt>
                    <dd className="font-mono-tabular font-semibold text-slate-900">
                      {confirmedBooking.preferredDate}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 font-medium">Pickup &amp; Drop</dt>
                    <dd className="font-semibold text-slate-900">
                      {confirmedBooking.pickupNeeded ? 'Haan' : 'Nahi'}
                    </dd>
                  </div>
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={confirmedWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>WhatsApp par Bhejein</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetBooking}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Nayi Booking Karein</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1">
                  {/* Card Heading kept in English */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                    Direct Service Booking
                  </h3>
                  <p className="text-sm text-slate-600">
                    Apni details bharein aur turant online book karein — aapki booking seedhe hamare
                    backend mein save hogi.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="customer-name-input"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Aapka Naam
                    </label>
                    <input
                      id="customer-name-input"
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Jaise: Rahul Kumar"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="customer-phone-input"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Mobile Number
                    </label>
                    <input
                      id="customer-phone-input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        if (formError) setFormError(null);
                      }}
                      placeholder="10 ankon ka number"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder:text-slate-400 text-sm font-mono-tabular focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label
                      htmlFor="bike-model-input"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Bike / Scooter ka Model
                    </label>
                    <input
                      id="bike-model-input"
                      type="text"
                      value={bikeModel}
                      onChange={(e) => {
                        setBikeModel(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      placeholder="Jaise: Hero Splendor, Pulsar 150"
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="booking-date-input"
                      className="block text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Service ki Tarikh
                    </label>
                    <input
                      id="booking-date-input"
                      type="date"
                      min={todayDate}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm font-mono-tabular focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service-select"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Seva Chunein
                  </label>
                  <select
                    id="service-select"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                  >
                    {BIKE_SERVICES.map((service) => (
                      <option key={service.id} value={service.name}>
                        {String(service.id).padStart(2, '0')}. {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="issue-notes"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Samasya ka Vivaran (Vaikalpik)
                  </label>
                  <textarea
                    id="issue-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Starting ki samasya, brake ki aawaz, oil badalwana aadi..."
                    className="w-full px-4 py-2 rounded-xl bg-white border border-emerald-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 resize-none"
                  />
                </div>

                <label className="flex items-center gap-2.5 text-sm font-medium text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pickupNeeded}
                    onChange={(e) => setPickupNeeded(e.target.checked)}
                    className="w-4 h-4 rounded border-emerald-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  <span>Bike pickup aur drop seva chahiye</span>
                </label>

                {formError && (
                  <p role="alert" className="text-sm font-medium text-red-700">
                    {formError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[46px] rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <CalendarCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{submitting ? 'Booking ho rahi hai...' : 'Direct Book Karein'}</span>
                  </button>

                  <a
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] rounded-xl border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
