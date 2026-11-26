import {useEffect, useMemo, useState} from 'react';
import QRCode from 'qrcode';
import {ExternalLink, QrCode} from 'lucide-react';
import {
  CONTACT_NUMBER,
  DEFAULT_PUBLIC_SITE_URL,
  OWNER_NAME,
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

export default function QrCodeSection() {
  const targetUrl = useMemo(() => getInitialSiteUrl(), []);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    let active = true;

    QRCode.toDataURL(targetUrl, {
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
  }, [targetUrl]);

  return (
    <section
      id="qr-scanner"
      className="py-14 sm:py-16 bg-emerald-50/40 border-t border-emerald-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
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
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-emerald-800 hover:underline break-all"
            >
              <span>{targetUrl.replace(/\/$/, '')}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
