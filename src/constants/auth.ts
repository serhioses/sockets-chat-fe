import { z } from 'zod';

export const signUpSchema = z.object({
    fullName: z
        .string({ message: 'Full name is required' })
        .trim()
        .min(1, 'Full name must be at least 1 character long.')
        .max(64, 'Full name cannot be more than 64 characters.'),
    email: z.string({ message: 'Email is required' }).email(),
    password: z
        .string({ message: 'Password is required' })
        .min(6, 'Password must be at least 6 characters.'),
});

export const loginSchema = z.object({
    email: z.string({ message: 'Email is required' }).email(),
    password: z
        .string({ message: 'Password is required' })
        .min(6, 'Password must be at least 6 characters.'),
});
