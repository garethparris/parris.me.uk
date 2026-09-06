// src/lib/contact.ts

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
