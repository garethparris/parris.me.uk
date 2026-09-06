// functions/api/contact.ts
interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

export async function extractContactFields(formData: FormData): Promise<
  { ok: true; name: string; email: string; message: string } | { ok: false; error: string }
> {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  if (typeof name !== 'string' || !name.trim()) return { ok: false, error: 'Missing name' };
  if (typeof email !== 'string' || !email.includes('@')) return { ok: false, error: 'Invalid email' };
  if (typeof message !== 'string' || !message.trim()) return { ok: false, error: 'Missing message' };

  return { ok: true, name, email, message };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();
  const fields = await extractContactFields(formData);

  if (!fields.ok) {
    return new Response(JSON.stringify({ error: fields.error }), { status: 400 });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'parris.me.uk contact form <noreply@parris.me.uk>',
      to: context.env.CONTACT_TO_EMAIL,
      reply_to: fields.email,
      subject: `New contact form message from ${fields.name}`,
      text: fields.message,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
