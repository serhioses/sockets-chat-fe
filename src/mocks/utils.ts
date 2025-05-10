export function clearCookies(): void {
    Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
    });
}
