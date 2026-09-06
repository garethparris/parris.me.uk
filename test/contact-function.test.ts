import { describe, it, expect } from 'vitest';
import { extractContactFields } from '../functions/api/contact';

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
