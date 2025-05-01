import { Image, Send, X } from 'lucide-react';

import { Form } from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/form/FormInput';
import { ALLOWED_IMAGE_FORMATS } from '@/constants/file';
import { sendMessageSchema } from '@/constants/chat';
import { TSendMessageFormValues } from '@/types/chat';
import { useImagePreview } from '@/hooks/useImagePreview';
import { useBoundStore } from '@/store/useBoundStore';

export function ChatInput() {
    const { sendMessage } = useBoundStore();
    const methods = useForm({
        resolver: zodResolver(sendMessageSchema),
        reValidateMode: 'onSubmit',
    });
    const { imagePreview, deleteImagePreview } = useImagePreview(
        methods.watch('image'),
        resetImage,
    );

    function resetImage() {
        methods.resetField('image');

        const fileINput = document.getElementById('chat-image');
        if (fileINput && fileINput instanceof HTMLInputElement) {
            fileINput.value = '';
        }
    }

    async function handleSubmit(data: TSendMessageFormValues) {
        // const formData = new FormData();
        // formData.set('text', data.text ?? '');
        // formData.set('image', data.image ?? '');

        // await sendMessage(formData);
        await sendMessage(data);

        methods.setValue('text', '');
        deleteImagePreview();
        resetImage();
    }

    return (
        <div className="p-4 w-full">
            {!!imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={deleteImagePreview}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center cursor-pointer"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <Form methods={methods} onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-2">
                        <div>
                            <FormInput
                                id="chat-image"
                                className="hidden"
                                name="image"
                                type="file"
                                accept={ALLOWED_IMAGE_FORMATS.join(', ')}
                                wrapperClassName="mb-0!"
                            />
                            <label htmlFor="chat-image" className="hidden sm:flex btn btn-circle">
                                <Image size={20} />
                            </label>
                        </div>
                        <div className="flex-1">
                            <FormInput
                                name="text"
                                placeholder="Type here..."
                                wrapperClassName="mb-0!"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-sm btn-circle"
                        // disabled={!text.trim() && !imagePreview}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </Form>
        </div>
    );
}
