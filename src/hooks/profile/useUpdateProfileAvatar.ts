import { useEffect } from 'react';

import { useBoundStore } from '@/store/useBoundStore';
import { useAsync } from '@/hooks/useAsync';
import { TUser } from '@/types/user';
import { ALLOWED_IMAGE_FORMATS, MAX_FILE_SIZE_BYTES } from '@/constants/file';
import { EAsyncStatus } from '@/constants/status';
import { http } from '@/lib/axios';
import { TMaybe } from '@/types/utilities';

type TProfileResponse<T> = {
    data?: TMaybe<T>;
    errors?: { message: string }[];
};

export function useUpdateProfileAvatar() {
    const { user, getMe } = useBoundStore();
    const { run, status, data, error, dispatch } = useAsync<TUser, TProfileResponse<TUser>>();

    useEffect(() => {
        if (data?.avatar) {
            useBoundStore.setState((state) => {
                if (state.user) {
                    return { user: data };
                }

                return state;
            });
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            getMe();
        }
    }, [data, getMe]);

    async function updateProfileAvatar(file: File) {
        if (file.size > MAX_FILE_SIZE_BYTES) {
            dispatch({ type: EAsyncStatus.IDLE, error: 'File cannot be larger than 5MB.' });

            return;
        }

        if (!ALLOWED_IMAGE_FORMATS.includes(file.type)) {
            dispatch({ type: EAsyncStatus.IDLE, error: 'Allowed image formats: PNG, JPEG.' });

            return;
        }

        const formData = new FormData();
        formData.set('avatar', file);

        try {
            const promise = http.put<TProfileResponse<TUser>>('/profile/update-profile', formData, {
                headers: { 'Content-type': 'multipart/form-data' },
            });

            await run(promise);
        } catch {
            dispatch({ type: EAsyncStatus.REJECTED, error: 'Something went wrong.' });
        }
    }

    return { user, status, error, updateProfileAvatar };
}
