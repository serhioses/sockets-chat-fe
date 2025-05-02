import { useEffect, useState } from 'react';

import { TMaybe } from '@/types/utilities';

export function useImagePreview(image: TMaybe<File>, onDelete?: VoidFunction) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    function deleteImagePreview() {
        setImagePreview(null);
        onDelete?.();
    }

    useEffect(() => {
        if (!image) {
            return;
        }

        const reader = new FileReader();

        function handleLoad() {
            setImagePreview(reader.result as string);
        }

        reader.addEventListener('load', handleLoad);
        reader.readAsDataURL(image);

        return () => {
            reader.removeEventListener('load', handleLoad);
        };
    }, [image]);

    return { imagePreview, deleteImagePreview };
}
