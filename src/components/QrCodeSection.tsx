import {useEffect, useMemo, useState} from 'react';
import QRCode from 'qrcode';
import {Check, Copy, Download, ExternalLink, Printer, QrCode, RotateCcw} from 'lucide-react';
import {
  CONTACT_NUMBER,
  DEFAULT_PUBLIC_SITE_URL,
  DEVELOPER_CREDIT,
  OWNER_NAME,
  SHOP_ADDRESS,
  SHOP_NAME,
} from '../constants/workshop';

function getInitialSiteUrl(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_PUBLIC_SITE_URL;
  }
  const {protocol, hostname, origin} = window.location;
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    protocol !== 'https:';
  return isLocal ? DEFAULT_PUBLIC_SITE_URL : origin;
}

function normalizeHttpUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

export default function QrCodeSection() {
  const defaultUrl = useMemo(() => getInitialSiteUrl(), []);
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isDownloadingPoster, setIsDownloadingPoster] = useState(false);

  const validUrl = useMemo(() => normalizeHttpUrl(urlInput), [urlInput]);

  useEffect(() => {
    let active = true;
    const target = validUrl ?? DEFAULT_PUBLIC_SITE_URL;

    QRCode.toDataURL(target, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 560,
      color: {
        dark: '#052e16',
        light: '#ffffff',
      },
    })
      .then((dataUrl) => {
        if (active) {
          setQrDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setQrDataUrl('');
        }
      });

    return () => {
      active = false;
    };
  }, [validUrl]);

  async function handleCopyLink(): Promise<void> {
    const target = validUrl ?? DEFAULT_PUBLIC_SITE_URL;
    try {
      await navigator.clipboard.writeText(target);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  function handleDownloadQrOnly(): void {
    if (!qrDataUrl) {
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = qrDataUrl;
    anchor.download = 'maa-lakshmi-auto-service-qr.png';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  async function handleDownloadPoster(): Promise<void> {
    const target = validUrl ?? DEFAULT_PUBLIC_SITE_URL;
    setIsDownloadingPoster(true);
    try {
      const highResQr = await QRCode.toDataURL(target, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 680,
        color: {
          dark: '#052e16',
          light: '#ffffff',
        },
      });

      const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('QR image load failed'));
        image.src = highResQr;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1420;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      // Clean white poster canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top dark green shop banner
      ctx.fillStyle = '#052e16';
      ctx.fillRect(0, 0, canvas.width, 320);

      // Gold accent bar
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 320, canvas.width, 14);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '600 26px sans-serif';
      ctx.fillText('BIKE REPAIRING & SERVICING CENTER', canvas.width / 2, 72);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 46px sans-serif';
      ctx.fillText(SHOP_NAME, canvas.width / 2, 142);

      ctx.fillStyle = '#fcd34d';
      ctx.font = '700 34px sans-serif';
      ctx.fillText(OWNER_NAME, canvas.width / 2, 200);

      ctx.fillStyle = '#d1fae5';
      ctx.font = '500 26px sans-serif';
      ctx.fillText(SHOP_ADDRESS, canvas.width / 2, 250);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 30px monospace';
      ctx.fillText(`Mob: ${CONTACT_NUMBER}`, canvas.width / 2, 294);

      // Outer border frame around QR area
      ctx.strokeStyle = '#065f46';
      ctx.lineWidth = 6;
      ctx.strokeRect(170, 390, 740, 740);

      // Draw QR code centered
      ctx.drawImage(qrImg, 200, 420, 680, 680);

      // Scan instruction below QR
      ctx.fillStyle = '#052e16';
      ctx.font = '800 38px sans-serif';
      ctx.fillText('Scan Karein & Website Kholein', canvas.width / 2, 1205);

      ctx.fillStyle = '#334155';
      ctx.font = '500 26px sans-serif';
      ctx.fillText(
        'Phone camera ya Google Lens se scan karke direct booking karein',
        canvas.width / 2,
        1255,
      );

      // Display clean URL and footer credit
      ctx.fillStyle = '#047857';
      ctx.font = '600 24px monospace';
      ctx.fillText(target.replace(/\/$/, ''), canvas.width / 2, 1320);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 22px sans-serif';
      ctx.fillText(DEVELOPER_CREDIT, canvas.width / 2, 1378);

      const posterUrl = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.href = posterUrl;
      anchor.download = 'maa-lakshmi-auto-service-qr-poster.png';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } finally {
      setIsDownloadingPoster(false);
    }
  }

  const activeTargetUrl = validUrl ?? DEFAULT_PUBLIC_SITE_URL;

  return (
    <section
      id="qr-scanner"
      className="py-14 sm:py-20 bg-white border-t border-emerald-100 print:py-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Hinglish explanation, editable URL input & download/print controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                  Dukan par Lagane ke Liye Official QR Code
                </p>
                {/* Main Heading in English */}
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-balance">
                  Scan QR Code to Open Website
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  Is QR scanner ko apne mobile camera, Google Lens ya kisi bhi QR app se scan karte hi
                  sidhe <strong className="text-slate-900">{SHOP_NAME}</strong> ki website khul
                  jayegi. Aap iska poster download karke dukan par print bhi laga sakte hain.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="qr-website-url"
                    className="block text-sm font-semibold text-slate-800"
                  >
                    Website Link (QR mein set URL)
                  </label>
                  {urlInput !== defaultUrl && (
                    <button
                      type="button"
                      onClick={() => setUrlInput(defaultUrl)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Live Link Reset Karein</span>
                    </button>
                  )}
                </div>
                <input
                  id="qr-website-url"
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={DEFAULT_PUBLIC_SITE_URL}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
                {!validUrl && (
                  <p className="text-xs font-medium text-red-700" role="alert">
                    Kripya https:// se shuru hone wala sahi website link likhein.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadPoster}
                  disabled={!qrDataUrl || isDownloadingPoster}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>
                    {isDownloadingPoster ? 'Poster Ban Raha Hai...' : 'Shop QR Poster Download Karein'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQrOnly}
                  disabled={!qrDataUrl}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-900 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  <QrCode className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Sirf QR Download</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                >
                  {copied ? (
                    <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{copied ? 'Link Copy Ho Gaya' : 'Link Copy Karein'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 print:hidden"
                >
                  <Printer className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Print Karein</span>
                </button>
              </div>
            </div>

            {/* Right: Crisp Scannable QR Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm text-center space-y-4">
                <div className="space-y-1 border-b border-emerald-100 pb-3">
                  <p className="font-display text-base font-extrabold text-emerald-950 tracking-tight">
                    {SHOP_NAME}
                  </p>
                  <p className="text-xs font-semibold text-amber-700">
                    {OWNER_NAME} · {CONTACT_NUMBER}
                  </p>
                </div>

                <div className="mx-auto w-56 h-56 sm:w-64 sm:h-64 rounded-xl border border-emerald-200 bg-white p-3 flex items-center justify-center">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`${SHOP_NAME} Website QR Code`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-emerald-700">
                      <QrCode className="w-12 h-12" aria-hidden="true" />
                      <span className="text-xs font-medium">QR Code Taiyar Ho Raha Hai...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    Camera se Scan Karein &amp; Website Kholein
                  </p>
                  <a
                    href={activeTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800 hover:underline break-all"
                  >
                    <span>{activeTargetUrl.replace(/\/$/, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
