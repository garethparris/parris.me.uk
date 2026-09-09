import { describe, it, expect } from 'vitest';
import { formatPostDate } from '../src/lib/blog';

describe('formatPostDate', () => {
  it('formats the ISO date without a time component', () => {
    const { iso } = formatPostDate(new Date('2025-11-01T00:00:00.000Z'));
    expect(iso).toBe('2025-11-01');
  });

  it('formats the display date in en-GB long form', () => {
    const { display } = formatPostDate(new Date('2025-11-01T00:00:00.000Z'));
    expect(display).toBe('1 November 2025');
  });
});
