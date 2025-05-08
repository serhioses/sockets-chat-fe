import { expect, it } from 'vitest';
import { formatDate } from '@/lib/utils/date';

it('should correctly format date string', () => {
    const dateString = '2025-05-07T20:10:06.674Z';
    expect(formatDate(dateString, 'en-US', { timeZone: 'UTC' })).toBe('Wed, May 7, 2025, 08:10 PM');
});
