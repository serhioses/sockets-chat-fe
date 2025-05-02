import { EAsyncStatus } from '@/constants/status';
import { TMaybe } from '@/types/utilities';

export type THttpResponse<T> = {
    data?: TMaybe<T>;
    errors?: { message: string }[];
    formErrors?: string[];
};

export type THttpState = {
    status: EAsyncStatus;
    error?: TMaybe<string>;
    formErrors?: TMaybe<string[]>;
};
