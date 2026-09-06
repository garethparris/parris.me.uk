import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  extractContactFields,
  verifyTurnstileToken,
  HONEYPOT_FIELD,
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
} from '../src/lib/contact';

function formDataWith(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

describe('extractContactFields', () => {
  it('accepts a complete, valid submission', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'jane@example.com', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: true, name: 'Jane Doe', email: 'jane@example.com', message: 'Hello!' });
  });

  it('rejects a missing name', async () => {
    const result = await extractContactFields(
      formDataWith({ name: '', email: 'jane@example.com', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: false, error: 'Missing name' });
  });

  it('rejects an email without an @', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'not-an-email', message: 'Hello!' })
    );
    expect(result).toEqual({ ok: false, error: 'Invalid email' });
  });

  it('rejects a missing message', async () => {
    const result = await extractContactFields(
      formDataWith({ name: 'Jane Doe', email: 'jane@example.com', message: '' })
    );
    expect(result).toEqual({ ok: false, error: 'Missing message' });
  });
});

describe('abuse protection', () => {
  it('rejects a submission with the honeypot field filled in', async () => {
    const result = await extractContactFields(
      formDataWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
        [HONEYPOT_FIELD]: 'http://spam.example.com',
      })
    );
    expect(result).toEqual({ ok: false, error: 'Invalid submission' });
  });

  it('accepts a submission with the honeypot field present but empty', async () => {
    // A real browser submits the hidden input as an empty string, so an
    // empty honeypot must not be mistaken for bot traffic.
    const result = await extractContactFields(
      formDataWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello!',
        [HONEYPOT_FIELD]: '',
      })
    );
    expect(result).toEqual({
      ok: true,
      name: 'Jane Doe',
      email: 'jane@example.com',
      message: 'Hello!',
    });
  });

  it('accepts a name and message exactly at the length limits', async () => {
    const name = 'a'.repeat(MAX_NAME_LENGTH);
    const message = 'b'.repeat(MAX_MESSAGE_LENGTH);
    const result = await extractContactFields(
      formDataWith({ name, email: 'jane@example.com', message })
    );
    expect(result).toEqual({ ok: true, name, email: 'jane@example.com', message });
  });

  it('rejects a name over the length limit', async () => {
    const result = await extractContactFields(
      formDataWith({
        name: 'a'.repeat(MAX_NAME_LENGTH + 1),
        email: 'jane@example.com',
        message: 'Hello!',
      })
    );
    expect(result).toEqual({ ok: false, error: 'Name too long' });
  });

  it('rejects a message over the length limit', async () => {
    const result = await extractContactFields(
      formDataWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'b'.repeat(MAX_MESSAGE_LENGTH + 1),
      })
    );
    expect(result).toEqual({ ok: false, error: 'Message too long' });
  });
});

describe('verifyTurnstileToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects an empty token without calling Turnstile', async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);

    const result = await verifyTurnstileToken('', 'secret');

    expect(result).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('accepts a token Turnstile reports as valid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
    );

    const result = await verifyTurnstileToken('a-real-token', 'secret');

    expect(result).toBe(true);
  });

  it('rejects a token Turnstile reports as invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }), {
          status: 200,
        })
      )
    );

    const result = await verifyTurnstileToken('a-fake-token', 'secret');

    expect(result).toBe(false);
  });

  it('sends the token, secret and remote IP to the siteverify endpoint', async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
    vi.stubGlobal('fetch', fetchSpy);

    await verifyTurnstileToken('a-real-token', 'my-secret', '203.0.113.1');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' })
    );
    const sentBody = fetchSpy.mock.calls[0][1].body as URLSearchParams;
    expect(sentBody.get('secret')).toBe('my-secret');
    expect(sentBody.get('response')).toBe('a-real-token');
    expect(sentBody.get('remoteip')).toBe('203.0.113.1');
  });
});
