import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const DATA_DIR = resolveWritableDataDir();
const OWNER_PHOTO_FILE = resolveSafeDataPath('owner-photo.json');
const ADMIN_AUTH_FILE = resolveSafeDataPath('admin-auth.json');
const BOOKINGS_FILE = resolveSafeDataPath('bookings.json');
const REVIEWS_FILE = resolveSafeDataPath('reviews.json');

// Session signing key: read from env or fall back to an in-memory random 256-bit key.
const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.trim().length >= 16
    ? process.env.SESSION_SECRET.trim()
    : crypto.randomBytes(32).toString('hex');

const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB decoded image limit
const ALLOWED_IMAGE_DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;
const SUPABASE_HOST_RE = /^https:\/\/[a-z0-9-]+\.supabase\.co$/;
const SUPABASE_PROJECT_ID_RE = /^[a-z0-9-]{8,40}$/;

function resolveWritableDataDir(): string {
  const isServerless = Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    return path.resolve(os.tmpdir(), 'mlasc-data');
  }
  return path.resolve(process.cwd(), 'data');
}

function resolveSafeDataPath(fileName: string): string {
  const resolved = path.resolve(DATA_DIR, fileName);
  if (!resolved.startsWith(DATA_DIR + path.sep)) {
    throw new Error('Invalid data file path');
  }
  return resolved;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, {recursive: true});
  }
}

export interface OwnerPhotoRecord {
  photoUrl: string;
  updatedAt: string;
}

export interface AdminAuthRecord {
  salt: string;
  hash: string;
  claimedAt: string;
}

export interface BookingRecord {
  id: string;
  referenceCode: string;
  customerName: string;
  customerPhone: string;
  bikeModel: string;
  serviceName: string;
  preferredDate: string;
  pickupNeeded: boolean;
  notes: string;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  customerName: string;
  bikeModel: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface SupabaseConfig {
  baseUrl: string;
  readKey: string;
  writeKey: string;
  hasServiceRole: boolean;
}

function getSupabaseConfig(): SupabaseConfig | null {
  let baseUrl = '';
  const rawUrl = process.env.SUPABASE_URL?.trim();
  const rawProjectId = process.env.SUPABASE_PROJECT_ID?.trim();

  if (rawUrl && SUPABASE_HOST_RE.test(rawUrl)) {
    baseUrl = rawUrl;
  } else if (rawProjectId && SUPABASE_PROJECT_ID_RE.test(rawProjectId)) {
    baseUrl = `https://${rawProjectId}.supabase.co`;
  }

  const publishableKey = process.env.SUPABASE_API_KEY?.trim() ?? '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';

  if (!baseUrl || (!publishableKey && !serviceRoleKey)) {
    return null;
  }

  return {
    baseUrl,
    readKey: serviceRoleKey || publishableKey,
    writeKey: serviceRoleKey || publishableKey,
    hasServiceRole: serviceRoleKey.length > 0,
  };
}

async function supabaseGetStoreRow<T>(key: 'owner_photo' | 'admin_auth'): Promise<T | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return null;
  }

  try {
    const url = new URL('/rest/v1/workshop_store', cfg.baseUrl);
    url.searchParams.set('key', `eq.${key}`);
    url.searchParams.set('select', 'value,updated_at');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: cfg.readKey,
        Authorization: `Bearer ${cfg.readKey}`,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return null;
    }

    const rows = (await res.json()) as Array<{value?: T}>;
    if (Array.isArray(rows) && rows.length > 0 && rows[0]?.value) {
      return rows[0].value;
    }
    return null;
  } catch {
    return null;
  }
}

async function supabaseUpsertStoreRow(
  key: 'owner_photo' | 'admin_auth',
  value: unknown,
  insertOnly = false,
): Promise<{ok: boolean; conflict?: boolean}> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return {ok: false};
  }

  try {
    const url = new URL('/rest/v1/workshop_store', cfg.baseUrl);
    if (!insertOnly) {
      url.searchParams.set('on_conflict', 'key');
    }

    const prefer = insertOnly
      ? 'return=representation'
      : 'resolution=merge-duplicates,return=representation';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: cfg.writeKey,
        Authorization: `Bearer ${cfg.writeKey}`,
        'Content-Type': 'application/json',
        Prefer: prefer,
      },
      body: JSON.stringify({
        key,
        value,
        updated_at: new Date().toISOString(),
      }),
    });

    if (insertOnly && res.status === 409) {
      return {ok: false, conflict: true};
    }

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Supabase workshop_store upsert failed (${res.status}):`, detail.slice(0, 300));
    }

    return {ok: res.ok};
  } catch (err: unknown) {
    console.error('Supabase workshop_store request error:', err);
    return {ok: false};
  }
}

async function supabaseInsertBooking(booking: BookingRecord): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return false;
  }

  try {
    const url = new URL('/rest/v1/service_bookings', cfg.baseUrl);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: cfg.writeKey,
        Authorization: `Bearer ${cfg.writeKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        id: booking.id,
        reference_code: booking.referenceCode,
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        bike_model: booking.bikeModel,
        service_name: booking.serviceName,
        preferred_date: booking.preferredDate,
        pickup_needed: booking.pickupNeeded,
        notes: booking.notes,
        created_at: booking.createdAt,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Supabase service_bookings insert failed (${res.status}):`, detail.slice(0, 300));
    }
    return res.ok;
  } catch (err: unknown) {
    console.error('Supabase service_bookings request error:', err);
    return false;
  }
}

async function supabaseListBookings(): Promise<BookingRecord[] | null> {
  const cfg = getSupabaseConfig();
  if (!cfg || !cfg.hasServiceRole) {
    return null;
  }

  try {
    const url = new URL('/rest/v1/service_bookings', cfg.baseUrl);
    url.searchParams.set('select', '*');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', '100');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: cfg.readKey,
        Authorization: `Bearer ${cfg.readKey}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      return null;
    }

    const rows = (await res.json()) as Array<Record<string, unknown>>;
    return rows.map((row) => ({
      id: String(row.id ?? ''),
      referenceCode: String(row.reference_code ?? ''),
      customerName: String(row.customer_name ?? ''),
      customerPhone: String(row.customer_phone ?? ''),
      bikeModel: String(row.bike_model ?? ''),
      serviceName: String(row.service_name ?? ''),
      preferredDate: String(row.preferred_date ?? ''),
      pickupNeeded: Boolean(row.pickup_needed),
      notes: String(row.notes ?? ''),
      createdAt: String(row.created_at ?? ''),
    }));
  } catch {
    return null;
  }
}

async function supabaseListReviews(): Promise<ReviewRecord[] | null> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return null;
  }

  try {
    const url = new URL('/rest/v1/customer_reviews', cfg.baseUrl);
    url.searchParams.set('select', 'id,customer_name,bike_model,rating,comment,created_at');
    url.searchParams.set('order', 'created_at.desc');
    url.searchParams.set('limit', '50');

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: cfg.readKey,
        Authorization: `Bearer ${cfg.readKey}`,
        Accept: 'application/json',
      },
    });
    if (!res.ok) {
      return null;
    }

    const rows = (await res.json()) as Array<Record<string, unknown>>;
    return rows.map((row) => ({
      id: String(row.id ?? ''),
      customerName: String(row.customer_name ?? ''),
      bikeModel: String(row.bike_model ?? ''),
      rating: Math.min(5, Math.max(1, Math.round(Number(row.rating ?? 5)))),
      comment: String(row.comment ?? ''),
      createdAt: String(row.created_at ?? ''),
    }));
  } catch {
    return null;
  }
}

async function supabaseInsertReview(review: ReviewRecord): Promise<boolean> {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return false;
  }

  try {
    const url = new URL('/rest/v1/customer_reviews', cfg.baseUrl);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: cfg.writeKey,
        Authorization: `Bearer ${cfg.writeKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        id: review.id,
        customer_name: review.customerName,
        bike_model: review.bikeModel,
        rating: review.rating,
        comment: review.comment,
        created_at: review.createdAt,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`Supabase customer_reviews insert failed (${res.status}):`, detail.slice(0, 300));
    }
    return res.ok;
  } catch (err: unknown) {
    console.error('Supabase customer_reviews request error:', err);
    return false;
  }
}

function getEnvPasscode(): string | null {
  const raw = process.env.ADMIN_PASSCODE;
  if (typeof raw === 'string' && raw.trim().length > 0) {
    return raw.trim();
  }
  return null;
}

function readLocalClaimedAdmin(): AdminAuthRecord | null {
  try {
    if (!fs.existsSync(ADMIN_AUTH_FILE)) {
      return null;
    }
    const parsed = JSON.parse(fs.readFileSync(ADMIN_AUTH_FILE, 'utf8')) as Partial<AdminAuthRecord>;
    if (
      typeof parsed.salt === 'string' &&
      typeof parsed.hash === 'string' &&
      typeof parsed.claimedAt === 'string'
    ) {
      return {
        salt: parsed.salt,
        hash: parsed.hash,
        claimedAt: parsed.claimedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function readClaimedAdmin(): Promise<AdminAuthRecord | null> {
  const remote = await supabaseGetStoreRow<Partial<AdminAuthRecord>>('admin_auth');
  if (
    remote &&
    typeof remote.salt === 'string' &&
    typeof remote.hash === 'string' &&
    typeof remote.claimedAt === 'string'
  ) {
    return {
      salt: remote.salt,
      hash: remote.hash,
      claimedAt: remote.claimedAt,
    };
  }
  return readLocalClaimedAdmin();
}

function readLocalOwnerPhoto(): OwnerPhotoRecord | null {
  try {
    if (!fs.existsSync(OWNER_PHOTO_FILE)) {
      return null;
    }
    const parsed = JSON.parse(fs.readFileSync(OWNER_PHOTO_FILE, 'utf8')) as Partial<OwnerPhotoRecord>;
    if (
      typeof parsed.photoUrl === 'string' &&
      ALLOWED_IMAGE_DATA_URL_RE.test(parsed.photoUrl) &&
      typeof parsed.updatedAt === 'string'
    ) {
      return {
        photoUrl: parsed.photoUrl,
        updatedAt: parsed.updatedAt,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function readOwnerPhoto(): Promise<OwnerPhotoRecord | null> {
  const remote = await supabaseGetStoreRow<Partial<OwnerPhotoRecord>>('owner_photo');
  if (
    remote &&
    typeof remote.photoUrl === 'string' &&
    ALLOWED_IMAGE_DATA_URL_RE.test(remote.photoUrl) &&
    typeof remote.updatedAt === 'string'
  ) {
    return {
      photoUrl: remote.photoUrl,
      updatedAt: remote.updatedAt,
    };
  }
  return readLocalOwnerPhoto();
}

function appendLocalBooking(booking: BookingRecord): void {
  ensureDataDir();
  let existing: BookingRecord[] = [];
  try {
    if (fs.existsSync(BOOKINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
      if (Array.isArray(parsed)) {
        existing = parsed as BookingRecord[];
      }
    }
  } catch {
    existing = [];
  }
  existing.push(booking);
  const trimmed = existing.slice(-200);
  const tempFile = resolveSafeDataPath(`bookings.${crypto.randomBytes(6).toString('hex')}.tmp`);
  fs.writeFileSync(tempFile, JSON.stringify(trimmed, null, 2), 'utf8');
  fs.renameSync(tempFile, BOOKINGS_FILE);
}

function readLocalReviews(): ReviewRecord[] {
  try {
    if (!fs.existsSync(REVIEWS_FILE)) {
      return [];
    }
    const parsed = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf8'));
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as ReviewRecord[];
  } catch {
    return [];
  }
}

function appendLocalReview(review: ReviewRecord): void {
  ensureDataDir();
  const existing = readLocalReviews();
  existing.unshift(review);
  const trimmed = existing.slice(0, 100);
  const tempFile = resolveSafeDataPath(`reviews.${crypto.randomBytes(6).toString('hex')}.tmp`);
  fs.writeFileSync(tempFile, JSON.stringify(trimmed, null, 2), 'utf8');
  fs.renameSync(tempFile, REVIEWS_FILE);
}

function hashPasscode(passcode: string, saltHex: string): string {
  return crypto.scryptSync(passcode, saltHex, 64).toString('hex');
}

function timingSafeMatchString(a: string, b: string): boolean {
  const digestA = crypto.createHash('sha256').update(a).digest();
  const digestB = crypto.createHash('sha256').update(b).digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

function issueAdminToken(): string {
  const payload = Buffer.from(
    JSON.stringify({
      role: 'admin',
      exp: Date.now() + TOKEN_TTL_MS,
      nonce: crypto.randomBytes(12).toString('hex'),
    }),
    'utf8',
  ).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return false;
  }
  const [payload, signature] = parts;
  if (!payload || !signature) {
    return false;
  }
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(signature, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      role?: string;
      exp?: number;
    };
    return decoded.role === 'admin' && typeof decoded.exp === 'number' && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

function isAuthorizedAdmin(authHeader?: string | null): boolean {
  if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  return verifyAdminToken(token);
}

export interface ApiRequestInput {
  method: string;
  pathname: string;
  authHeader?: string | null;
  body?: Record<string, unknown>;
}

export interface ApiResponseOutput {
  status: number;
  data: unknown;
}

export async function handleApiRequest(input: ApiRequestInput): Promise<ApiResponseOutput> {
  const method = input.method.toUpperCase();
  const normalizedPath = input.pathname
    .replace(/^\/\.netlify\/functions\/api/, '/api')
    .replace(/\/+$/, '') || '/';
  const body = input.body ?? {};

  if (method === 'GET' && normalizedPath === '/api/health') {
    const cfg = getSupabaseConfig();
    const isNetlify = Boolean(
      process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.SITE_NAME,
    );
    return {
      status: 200,
      data: {
        ok: true,
        storage: cfg ? 'supabase' : 'local',
        hasServiceRole: Boolean(cfg?.hasServiceRole),
        platform: isNetlify ? 'netlify' : 'node',
      },
    };
  }

  if (method === 'GET' && normalizedPath === '/api/owner-photo') {
    const record = await readOwnerPhoto();
    return {
      status: 200,
      data: {
        photoUrl: record ? record.photoUrl : null,
        updatedAt: record ? record.updatedAt : null,
      },
    };
  }

  if (method === 'GET' && normalizedPath === '/api/admin/status') {
    const envPasscode = getEnvPasscode();
    if (envPasscode) {
      return {status: 200, data: {isConfigured: true, mode: 'env'}};
    }
    const claimed = await readClaimedAdmin();
    if (claimed) {
      return {status: 200, data: {isConfigured: true, mode: 'claimed'}};
    }
    return {status: 200, data: {isConfigured: false, mode: 'unclaimed'}};
  }

  if (method === 'POST' && normalizedPath === '/api/admin/claim') {
    if (getEnvPasscode()) {
      return {
        status: 409,
        data: {
          error: 'Administrator passcode is managed by environment settings. Use standard login.',
        },
      };
    }

    const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    if (passcode.length < 4 || passcode.length > 64) {
      return {status: 400, data: {error: 'Passcode must be between 4 and 64 characters.'}};
    }

    const existingRemote = await supabaseGetStoreRow<AdminAuthRecord>('admin_auth');
    if (existingRemote) {
      return {
        status: 409,
        data: {error: 'Administrator passcode has already been claimed. Please sign in.'},
      };
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPasscode(passcode, salt);
    const record: AdminAuthRecord = {
      salt,
      hash,
      claimedAt: new Date().toISOString(),
    };

    try {
      ensureDataDir();
      fs.writeFileSync(ADMIN_AUTH_FILE, JSON.stringify(record, null, 2), {
        encoding: 'utf8',
        flag: 'wx',
      });
    } catch (err: unknown) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code === 'EEXIST') {
        return {
          status: 409,
          data: {error: 'Administrator passcode has already been claimed. Please sign in.'},
        };
      }
      return {status: 500, data: {error: 'Unable to save administrator passcode.'}};
    }

    const remoteSave = await supabaseUpsertStoreRow('admin_auth', record, true);
    if (remoteSave.conflict) {
      return {
        status: 409,
        data: {error: 'Administrator passcode has already been claimed. Please sign in.'},
      };
    }

    return {status: 201, data: {token: issueAdminToken()}};
  }

  if (method === 'POST' && normalizedPath === '/api/admin/login') {
    const passcode = typeof body.passcode === 'string' ? body.passcode.trim() : '';
    if (!passcode || passcode.length > 64) {
      return {status: 400, data: {error: 'Please enter a valid passcode.'}};
    }

    const envPasscode = getEnvPasscode();
    if (envPasscode) {
      if (!timingSafeMatchString(passcode, envPasscode)) {
        return {status: 401, data: {error: 'Incorrect administrator passcode.'}};
      }
      return {status: 200, data: {token: issueAdminToken()}};
    }

    const claimed = await readClaimedAdmin();
    if (!claimed) {
      return {status: 409, data: {error: 'Administrator passcode has not been set up yet.'}};
    }

    const candidateHash = hashPasscode(passcode, claimed.salt);
    const hashBuf = Buffer.from(candidateHash, 'hex');
    const storedBuf = Buffer.from(claimed.hash, 'hex');

    if (hashBuf.length !== storedBuf.length || !crypto.timingSafeEqual(hashBuf, storedBuf)) {
      return {status: 401, data: {error: 'Incorrect administrator passcode.'}};
    }

    return {status: 200, data: {token: issueAdminToken()}};
  }

  if (method === 'POST' && normalizedPath === '/api/owner-photo') {
    if (!isAuthorizedAdmin(input.authHeader)) {
      return {
        status: 401,
        data: {error: 'Administrator session expired or invalid. Please sign in again.'},
      };
    }

    const photoUrl = typeof body.photoUrl === 'string' ? body.photoUrl.trim() : '';
    const match = ALLOWED_IMAGE_DATA_URL_RE.exec(photoUrl);
    if (!match) {
      return {status: 400, data: {error: 'Please upload a valid JPEG, PNG, or WebP image.'}};
    }

    const base64Body = match[2];
    const decoded = Buffer.from(base64Body, 'base64');
    if (decoded.length === 0 || decoded.length > MAX_IMAGE_BYTES) {
      return {status: 400, data: {error: 'Image size must be under 2 MB.'}};
    }

    const record: OwnerPhotoRecord = {
      photoUrl,
      updatedAt: new Date().toISOString(),
    };

    try {
      await supabaseUpsertStoreRow('owner_photo', record, false);

      ensureDataDir();
      const tempFile = resolveSafeDataPath(
        `owner-photo.${crypto.randomBytes(6).toString('hex')}.tmp`,
      );
      fs.writeFileSync(tempFile, JSON.stringify(record), 'utf8');
      fs.renameSync(tempFile, OWNER_PHOTO_FILE);
      return {status: 200, data: record};
    } catch {
      return {status: 500, data: {error: 'Failed to store the owner photo on the server.'}};
    }
  }

  if (method === 'POST' && normalizedPath === '/api/bookings') {
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const rawPhone =
      typeof body.customerPhone === 'string' ? body.customerPhone.replace(/\D/g, '') : '';
    const customerPhone =
      rawPhone.length === 12 && rawPhone.startsWith('91') ? rawPhone.slice(2) : rawPhone;
    const bikeModel = typeof body.bikeModel === 'string' ? body.bikeModel.trim() : '';
    const serviceName = typeof body.serviceName === 'string' ? body.serviceName.trim() : '';
    const preferredDate =
      typeof body.preferredDate === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(body.preferredDate.trim())
        ? body.preferredDate.trim()
        : new Date().toISOString().slice(0, 10);
    const pickupNeeded = Boolean(body.pickupNeeded);
    const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 500) : '';

    if (customerName.length < 2 || customerName.length > 80) {
      return {
        status: 400,
        data: {error: 'Kripya apna sahi naam likhein (kam se kam 2 akshar).'},
      };
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      return {
        status: 400,
        data: {error: 'Kripya 10 ankon ka sahi mobile number darj karein.'},
      };
    }
    if (bikeModel.length < 1 || bikeModel.length > 120) {
      return {
        status: 400,
        data: {error: 'Kripya apni bike ya scooter ka model likhein.'},
      };
    }
    if (serviceName.length < 1 || serviceName.length > 120) {
      return {
        status: 400,
        data: {error: 'Kripya sahi seva chunein.'},
      };
    }

    const booking: BookingRecord = {
      id: crypto.randomUUID(),
      referenceCode: `ML-${crypto.randomBytes(3).toString('hex').toUpperCase()}`,
      customerName,
      customerPhone,
      bikeModel,
      serviceName,
      preferredDate,
      pickupNeeded,
      notes,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedRemote = await supabaseInsertBooking(booking);
      if (!savedRemote) {
        appendLocalBooking(booking);
      }
      return {
        status: 201,
        data: {
          ok: true,
          storage: savedRemote ? 'supabase' : 'local',
          booking,
        },
      };
    } catch {
      return {
        status: 500,
        data: {error: 'Booking save karne mein samasya aayi. Kripya dobara koshish karein.'},
      };
    }
  }

  if (method === 'GET' && normalizedPath === '/api/bookings') {
    if (!isAuthorizedAdmin(input.authHeader)) {
      return {
        status: 401,
        data: {error: 'Administrator authorization required.'},
      };
    }

    const remoteBookings = await supabaseListBookings();
    if (remoteBookings) {
      return {status: 200, data: {bookings: remoteBookings}};
    }

    try {
      if (!fs.existsSync(BOOKINGS_FILE)) {
        return {status: 200, data: {bookings: []}};
      }
      const parsed = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf8'));
      return {status: 200, data: {bookings: Array.isArray(parsed) ? parsed : []}};
    } catch {
      return {status: 500, data: {error: 'Unable to read bookings.'}};
    }
  }

  if (method === 'GET' && normalizedPath === '/api/reviews') {
    const remoteReviews = await supabaseListReviews();
    const reviews = remoteReviews ?? readLocalReviews();
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1))
        : 0;

    return {
      status: 200,
      data: {
        reviews,
        totalReviews,
        averageRating,
      },
    };
  }

  if (method === 'POST' && normalizedPath === '/api/reviews') {
    const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
    const bikeModel = typeof body.bikeModel === 'string' ? body.bikeModel.trim().slice(0, 80) : '';
    const rawRating = Number(body.rating);
    const rating = Number.isInteger(rawRating) ? rawRating : NaN;
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

    if (customerName.length < 2 || customerName.length > 80) {
      return {
        status: 400,
        data: {error: 'Kripya apna sahi naam likhein (kam se kam 2 akshar).'},
      };
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return {
        status: 400,
        data: {error: 'Kripya 1 se 5 star ke beech rating chunein.'},
      };
    }
    if (comment.length < 5 || comment.length > 500) {
      return {
        status: 400,
        data: {error: 'Kripya apna anubhav kam se kam 5 aksharon mein likhein.'},
      };
    }

    const review: ReviewRecord = {
      id: crypto.randomUUID(),
      customerName,
      bikeModel,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      const savedRemote = await supabaseInsertReview(review);
      if (!savedRemote) {
        appendLocalReview(review);
      }
      return {
        status: 201,
        data: {
          ok: true,
          storage: savedRemote ? 'supabase' : 'local',
          review,
        },
      };
    } catch {
      return {
        status: 500,
        data: {error: 'Review save karne mein samasya aayi. Kripya dobara koshish karein.'},
      };
    }
  }

  return {status: 404, data: {error: 'API route not found.'}};
}
