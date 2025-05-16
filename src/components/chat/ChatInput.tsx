import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Image, Send, Smile, X } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

import './ChatInput.css';
import { Form } from '@/components/form/Form';
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
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    useEffect(() => {
        function clickOutsideHandler(e: MouseEvent) {
            const target = e.target as HTMLElement | null;

            if (!target || target.closest('.emoji-picker')) {
                return;
            }
            if (target.closest('.emoji-toggle')) {
                return;
            }

            setIsEmojiPickerOpen(false);
        }

        document.addEventListener('click', clickOutsideHandler);

        return () => {
            document.removeEventListener('click', clickOutsideHandler);
        };
    }, []);

    function resetImage() {
        methods.resetField('image');

        const fileINput = document.getElementById('chat-image');
        if (fileINput && fileINput instanceof HTMLInputElement) {
            fileINput.value = '';
        }
    }

    async function handleSubmit(data: TSendMessageFormValues) {
        await sendMessage(data);

        methods.setValue('text', '');
        deleteImagePreview();
        resetImage();
    }

    function handleEmojiClick(emojiData: EmojiClickData) {
        const currentText = (methods.getValues('text') ?? '').trimEnd();

        if (currentText === '') {
            methods.setValue('text', emojiData.emoji);
        } else {
            methods.setValue('text', currentText.trimEnd() + ' ' + emojiData.emoji);
        }

        setIsEmojiPickerOpen(false);
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
                                aria-label="Upload an image"
                            />
                            <label htmlFor="chat-image" className="hidden sm:flex btn btn-circle">
                                <Image size={20} />
                            </label>
                        </div>
                        <div className="relative">
                            <button
                                className="btn btn-circle emoji-toggle"
                                type="button"
                                onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                                aria-label="Add emoji"
                            >
                                <Smile />
                            </button>
                            <EmojiPicker
                                className="emoji-picker absolute! bottom-[100%] left-0"
                                lazyLoadEmojis={true}
                                skinTonesDisabled={true}
                                onEmojiClick={handleEmojiClick}
                                open={isEmojiPickerOpen}
                            />
                        </div>

                        <div className="flex-1">
                            <FormInput
                                name="text"
                                placeholder="Type here..."
                                wrapperClassName="mb-0! **:[&.text-error]:hidden"
                                aria-label="Message text"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-sm btn-circle"
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </Form>
        </div>
    );
}
