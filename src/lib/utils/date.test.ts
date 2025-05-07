import { expect, test } from 'vitest';
import { formatDate } from './date';

test('correctly formats date string', () => {
    const dateString = '2025-05-07T20:10:06.674Z';
    expect(formatDate(dateString, 'en-US')).toMatch(/wed/i);
});
