import { z } from 'zod';

import { ALLOWED_IMAGE_FORMATS, MAX_FILE_SIZE_BYTES } from '@/constants/file';

export const sendMessageSchema = z
    .object({
        text: z.string().trim().nullish(),
        image: z.instanceof(File).nullish(),
    })
    .superRefine(({ text, image }, ctx) => {
        if (!text?.trim() && !image) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['text'],
                message: '',
            });
        }

        if (image) {
            if (image.size > MAX_FILE_SIZE_BYTES) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['image'],
                    message: 'File cannot be larger than 5MB.',
                });
            } else if (!ALLOWED_IMAGE_FORMATS.includes(image.type)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['image'],
                    message: 'Allowed image formats: PNG, JPEG.',
                });
            }
        }
    });
