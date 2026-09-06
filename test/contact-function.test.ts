import { describe, it, expect } from 'vitest';
import {
  extractContactFields,
  HONEYPOT_FIELD,
  MAX_NAME_LENGTH,
  MAX_MESSAGE_LENGTH,
} from '../functions/api/contact';

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
