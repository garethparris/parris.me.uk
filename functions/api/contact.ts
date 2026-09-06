// functions/api/contact.ts
interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO_EMAIL: string;
}

// Abuse-protection limits. Generous enough that no genuine enquiry hits them,
// tight enough to stop a bot pasting a spam payload into the email body.
export const MAX_NAME_LENGTH = 200;
export const MAX_MESSAGE_LENGTH = 5000;

// Name of the hidden honeypot input rendered (off-screen) by the contact form.
// A human never sees it, so a non-empty value means a bot filled the form in.
export const HONEYPOT_FIELD = 'website';

export async function extractContactFields(formData: FormData): Promise<
  { ok: true; name: string; email: string; message: string } | { ok: false; error: string }
> {
  const honeypot = formData.get(HONEYPOT_FIELD);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  // Checked first so bot traffic short-circuits before any other work.
  // The error is deliberately vague: naming the honeypot would teach a
  // bot author exactly which field to leave alone next time.
  if (typeof honeypot === 'string' && honeypot.trim()) {
    return { ok: false, error: 'Invalid submission' };
  }

  if (typeof name !== 'string' || !name.trim()) return { ok: false, error: 'Missing name' };
  if (name.length > MAX_NAME_LENGTH) return { ok: false, error: 'Name too long' };
  if (typeof email !== 'string' || !email.includes('@')) return { ok: false, error: 'Invalid email' };
  if (typeof message !== 'string' || !message.trim()) return { ok: false, error: 'Missing message' };
  if (message.length > MAX_MESSAGE_LENGTH) return { ok: false, error: 'Message too long' };

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
