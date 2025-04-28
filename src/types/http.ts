import { TMaybe } from '@/types/utilities';

export type THttpResponse<T> = {
    data?: TMaybe<T>;
    errors?: { message: string }[];
    formErrors?: string[];
};
