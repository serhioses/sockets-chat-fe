import { z } from 'zod';

import { signUpSchema } from '@/constants/auth';

export type TSignUpFormValues = z.infer<typeof signUpSchema>;
