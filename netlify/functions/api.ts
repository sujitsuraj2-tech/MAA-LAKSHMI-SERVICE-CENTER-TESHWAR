import {handleApiRequest} from '../../server/workshopApi.ts';

export const config = {
  path: '/api/*',
};

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let body: Record<string, unknown> = {};

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    try {
      const parsed: unknown = await req.json();
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        body = parsed as Record<string, unknown>;
      }
    } catch {
      body = {};
    }
  }

  const result = await handleApiRequest({
    method: req.method,
    pathname: url.pathname,
    authHeader: req.headers.get('authorization'),
    body,
  });

  return new Response(JSON.stringify(result.data), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
