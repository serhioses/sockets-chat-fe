import { z } from 'zod';

import { loginSchema, signUpSchema } from '@/constants/auth';

export type TSignUpFormValues = z.infer<typeof signUpSchema>;
export type TLoginFormValues = z.infer<typeof loginSchema>;
