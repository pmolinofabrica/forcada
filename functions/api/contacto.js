const rateLimitStore = new Map();

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function getRateLimitKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  return `rl:${ip}`;
}

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimitStore.set(key, { windowStart: now, count: 1 });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const rlKey = getRateLimitKey(request);
  const rl = checkRateLimit(rlKey);
  if (!rl.allowed) {
    return new Response('Demasiadas solicitudes. Intentalo más tarde.', { status: 429 });
  }

  try {
    let nombre = '', email = '', tipo = '', mensaje = '';

    if (request.headers.get('content-type')?.includes('application/json')) {
      const body = await request.json();
      nombre = body.nombre || '';
      email = body._replyto || '';
      tipo = body.tipo || '';
      mensaje = body.mensaje || '';
    } else {
      const formData = await request.formData();
      nombre = formData.get('nombre') || '';
      email = formData.get('_replyto') || '';
      tipo = formData.get('tipo') || '';
      mensaje = formData.get('mensaje') || '';
    }

    const SHEETS_URL = env.SHEETS_URL || '';
    const FORM_TOKEN = env.FORM_TOKEN || '';

    if (!SHEETS_URL) {
      throw new Error('SHEETS_URL no está configurada');
    }

    if (!FORM_TOKEN) {
      throw new Error('FORM_TOKEN no está configurada');
    }

    const resp = await fetch(SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, tipo, mensaje, token: FORM_TOKEN }),
    });

    const text = await resp.text();

    if (!resp.ok || text !== 'ok') {
      throw new Error(`Error al guardar: ${text.slice(0, 200)}`);
    }

    return Response.redirect(`${url.origin}/contacto.html?enviado=ok`, 302);
  } catch (error) {
    return Response.redirect(`${url.origin}/contacto.html?enviado=error`, 302);
  }
}
