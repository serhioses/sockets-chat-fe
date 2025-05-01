export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        year: 'numeric',
        weekday: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
