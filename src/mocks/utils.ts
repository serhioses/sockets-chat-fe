export function clearCookies(): void {
    document.cookie.split(';').forEach((cookie) => {
        document.cookie = cookie
            .replace(/^ +/, '')
            .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
    });
}
