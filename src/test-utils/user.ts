export function buildFakeUser() {
    const rand = crypto.randomUUID() + '__';

    return {
        fullName: rand + 'John Doe',
        email: rand + 'test@test.com',
        password: rand + '123456',
    };
}
