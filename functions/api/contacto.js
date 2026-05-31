export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const nombre = formData.get('nombre') || '';
    const email = formData.get('_replyto') || '';
    const tipo = formData.get('tipo') || '';
    const mensaje = formData.get('mensaje') || '';

    const SHEETS_URL = context.env.SHEETS_URL || '';

    if (SHEETS_URL) {
      const resp = await fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, tipo, mensaje }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Sheets API error ${resp.status}: ${text.slice(0, 200)}`);
      }
    }

    return Response.redirect(`${url.origin}/contacto.html?enviado=ok`, 302);
  } catch (error) {
    return Response.redirect(`${url.origin}/contacto.html?enviado=error&detalle=${encodeURIComponent(error.message)}`, 302);
  }
}
