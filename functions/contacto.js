export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const SHEETS_URL = context.env.SHEETS_URL || '';

    if (SHEETS_URL) {
      await fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    const url = new URL(request.url);
    return Response.redirect(`${url.origin}/contacto.html?enviado=ok`, 302);
  } catch (error) {
    return new Response('Error al enviar el formulario', { status: 500 });
  }
}
