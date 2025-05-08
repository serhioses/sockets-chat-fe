export function formatDate(
    dateString: string,
    locales?: Intl.LocalesArgument,
    options: Intl.DateTimeFormatOptions = {},
) {
    return new Date(dateString).toLocaleDateString(locales, {
        month: 'short',
        year: 'numeric',
        weekday: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options,
    });
}
