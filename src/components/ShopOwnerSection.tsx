import {useEffect, useRef, useState, type ChangeEvent, type FormEvent} from 'react';
import {Camera, Lock, ShieldCheck, Unlock, User} from 'lucide-react';
import {CONTACT_NUMBER, OWNER_NAME, SHOP_NAME} from '../constants/workshop';

const PHOTO_CACHE_KEY = 'mlasc_owner_photo_cache';
const DEFAULT_OWNER_PHOTO_URL = '/assets/aistudio/image_8209a04d.png';

type AdminMode = 'loading' | 'env' | 'claimed' | 'unclaimed';

function optimizeOwnerImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Kripya JPG, PNG ya WebP photo file chunein.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Chuni gayi photo file padhi nahi ja saki.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Chuni gayi file ek sahi photo nahi hai.'));
      img.onload = () => {
        const maxSize = 720;
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxSize || height > maxSize) {
          if (width >= height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Is browser mein photo process nahi ho saki.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const webpDataUrl = canvas.toDataURL('image/webp', 0.86);
        if (webpDataUrl.startsWith('data:image/webp')) {
          resolve(webpDataUrl);
          return;
        }
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function ShopOwnerSection() {
  const [ownerPhotoUrl, setOwnerPhotoUrl] = useState<string | null>(() => {
    try {
      const cached = localStorage.getItem(PHOTO_CACHE_KEY);
      if (cached && cached.startsWith('data:image/')) {
        return cached;
      }
    } catch {
      // Ignore storage access errors
    }
    return null;
  });
  const [photoUpdatedAt, setPhotoUpdatedAt] = useState<string | null>(null);
  const [photoLoadError, setPhotoLoadError] = useState(false);
  const [adminMode, setAdminMode] = useState<AdminMode>('loading');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'error' | 'success'; text: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialState() {
      try {
        const [photoRes, statusRes] = await Promise.all([
          fetch('/api/owner-photo'),
          fetch('/api/admin/status'),
        ]);

        if (!cancelled && photoRes.ok) {
          const photoData = (await photoRes.json()) as {
            photoUrl: string | null;
            updatedAt: string | null;
          };
          if (photoData.photoUrl) {
            setOwnerPhotoUrl(photoData.photoUrl);
            setPhotoUpdatedAt(photoData.updatedAt);
            try {
              localStorage.setItem(PHOTO_CACHE_KEY, photoData.photoUrl);
            } catch {
              // Ignore storage errors
            }
          } else {
            setPhotoUpdatedAt(null);
          }
        }

        if (!cancelled && statusRes.ok) {
          const statusData = (await statusRes.json()) as {mode: 'env' | 'claimed' | 'unclaimed'};
          setAdminMode(statusData.mode);
        } else if (!cancelled) {
          setAdminMode('claimed');
        }
      } catch {
        if (!cancelled) {
          setAdminMode('claimed');
        }
      }
    }

    loadInitialState();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdminAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const passcode = passcodeInput.trim();
    if (passcode.length < 4) {
      setFeedback({type: 'error', text: 'Admin passcode kam se kam 4 aksharon ka hona chahiye.'});
      return;
    }

    setAuthSubmitting(true);
    setFeedback(null);

    try {
      const endpoint = adminMode === 'unclaimed' ? '/api/admin/claim' : '/api/admin/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({passcode}),
      });
      const result = (await response.json()) as {token?: string; error?: string};

      if (!response.ok || !result.token) {
        if (response.status === 409 && adminMode === 'unclaimed') {
          setAdminMode('claimed');
        }
        setFeedback({type: 'error', text: result.error ?? 'Admin satyapan safal nahi hua.'});
        return;
      }

      setAdminToken(result.token);
      setAdminMode(adminMode === 'unclaimed' ? 'claimed' : adminMode);
      setPasscodeInput('');
      setShowAuthForm(false);
      setFeedback({
        type: 'success',
        text: 'Admin access unlock ho gaya hai. Ab aap malik ki photo upload ya badal sakte hain.',
      });
    } catch {
      setFeedback({type: 'error', text: 'Admin satyapan ke dauran network samasya aayi.'});
    } finally {
      setAuthSubmitting(false);
    }
  }

  async function handlePhotoSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !adminToken) {
      return;
    }

    setUploading(true);
    setFeedback(null);

    try {
      const optimizedDataUrl = await optimizeOwnerImage(file);
      const response = await fetch('/api/owner-photo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({photoUrl: optimizedDataUrl}),
      });

      const result = (await response.json()) as {
        photoUrl?: string;
        updatedAt?: string;
        error?: string;
      };

      if (!response.ok || !result.photoUrl) {
        if (response.status === 401) {
          setAdminToken(null);
          setShowAuthForm(true);
        }
        setFeedback({type: 'error', text: result.error ?? 'Photo save nahi ho saki.'});
        return;
      }

      setOwnerPhotoUrl(result.photoUrl);
      setPhotoLoadError(false);
      setPhotoUpdatedAt(result.updatedAt ?? new Date().toISOString());
      try {
        localStorage.setItem(PHOTO_CACHE_KEY, result.photoUrl);
      } catch {
        // Ignore storage quota errors
      }
      setFeedback({
        type: 'success',
        text: 'Shop owner ki photo safaltapoorvak save kar di gayi hai.',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Chuni gayi photo process nahi ho saki.';
      setFeedback({type: 'error', text: message});
    } finally {
      setUploading(false);
    }
  }

  function handleLockAdmin() {
    setAdminToken(null);
    setShowAuthForm(false);
    setPasscodeInput('');
    setFeedback(null);
  }

  return (
    <section
      id="shop-owner"
      className="py-14 sm:py-20 bg-gradient-to-b from-white to-emerald-50 border-t border-emerald-100"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-10 text-center">
          <div className="space-y-1.5 mb-8">
            <p className="text-xs sm:text-sm font-semibold text-emerald-700">
              Workshop Netritva
            </p>
            {/* Main Section Heading kept in English */}
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Shop Owner
            </h2>
          </div>

          {/* Circular Portrait Frame */}
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-emerald-800 via-emerald-500 to-amber-400 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-emerald-50 flex items-center justify-center border-4 border-white">
                {!photoLoadError ? (
                  <img
                    src={ownerPhotoUrl ?? DEFAULT_OWNER_PHOTO_URL}
                    alt={`${OWNER_NAME} — ${SHOP_NAME}`}
                    referrerPolicy="no-referrer"
                    onError={() => setPhotoLoadError(true)}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-emerald-800 px-4">
                    <User className="w-16 h-16 text-emerald-700/80 mb-2" aria-hidden="true" />
                    <span className="font-display text-sm font-bold text-emerald-900">
                      {OWNER_NAME}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 space-y-1">
              {/* Owner Name Heading kept in English */}
              <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
                {OWNER_NAME}
              </h3>
              <p className="text-sm sm:text-base font-medium text-emerald-800">
                Malik aur Mukhya Mechanic · {SHOP_NAME}
              </p>
              <p className="font-mono-tabular text-sm text-slate-600">
                Sampark: {CONTACT_NUMBER}
              </p>
              {photoUpdatedAt && (
                <p className="text-xs text-slate-500 pt-0.5">
                  Photo update tithi: {new Date(photoUpdatedAt).toLocaleDateString('en-IN')}
                </p>
              )}
            </div>

            {/* Single Authorized Administrator Photo Upload Control */}
            <div className="mt-7 w-full max-w-md">
              {/* Single hidden file input on the entire website */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoSelected}
                className="hidden"
                aria-label="Shop owner photo upload karein"
              />

              {adminToken ? (
                <div className="flex flex-col items-center gap-3">
                  {/* ONLY ONE upload/change photo button on the entire website */}
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>
                      {uploading
                        ? 'Photo save ho rahi hai...'
                        : ownerPhotoUrl
                          ? 'Malik ki Photo Badlein'
                          : 'Malik ki Photo Upload Karein'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLockAdmin}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer py-1 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                  >
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Admin Access Lock Karein</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  {!showAuthForm ? (
                    <button
                      type="button"
                      disabled={adminMode === 'loading'}
                      onClick={() => {
                        setShowAuthForm(true);
                        setFeedback(null);
                      }}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-700" aria-hidden="true" />
                      <span>
                        {adminMode === 'unclaimed'
                          ? 'Admin Setup: Malik ki Photo Upload Karein'
                          : 'Photo Badalne ke liye Admin Login Karein'}
                      </span>
                    </button>
                  ) : (
                    <form
                      onSubmit={handleAdminAuth}
                      className="w-full bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-left space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {adminMode === 'unclaimed'
                            ? 'Admin Passcode Set Karein'
                            : 'Admin Satyapan'}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAuthForm(false);
                            setFeedback(null);
                          }}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Radd Karein
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {adminMode === 'unclaimed'
                          ? 'Pehli baar setup: Shop Owner ki photo surakshit rakhne ke liye kam se kam 4 aksharon ka passcode banayein.'
                          : 'Shop Owner ki photo upload ya badalne ke liye apna admin passcode darj karein.'}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="password"
                          value={passcodeInput}
                          onChange={(e) => setPasscodeInput(e.target.value)}
                          placeholder={
                            adminMode === 'unclaimed'
                              ? 'Naya admin passcode banayein'
                              : 'Admin passcode darj karein'
                          }
                          aria-label="Admin passcode"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        <button
                          type="submit"
                          disabled={authSubmitting}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-emerald-800 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm cursor-pointer whitespace-nowrap"
                        >
                          <Unlock className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span>
                            {authSubmitting
                              ? 'Jaanch jaari hai...'
                              : adminMode === 'unclaimed'
                                ? 'Save aur Unlock Karein'
                                : 'Unlock Karein'}
                          </span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {feedback && (
                <p
                  role="status"
                  className={`mt-3 text-xs sm:text-sm font-medium ${
                    feedback.type === 'error' ? 'text-red-700' : 'text-emerald-800'
                  }`}
                >
                  {feedback.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
