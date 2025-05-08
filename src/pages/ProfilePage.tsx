import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { Camera, Mail, User } from 'lucide-react';

import { ALLOWED_IMAGE_FORMATS } from '@/constants/file';
import { EAsyncStatus } from '@/constants/status';
import { useUpdateProfileAvatar } from '@/hooks/profile/useUpdateProfileAvatar';

export default function ProfilePage() {
    const { user, updateProfileAvatar, error, status } = useUpdateProfileAvatar();

    if (!user) {
        return;
    }

    const isLoading = status === EAsyncStatus.PENDING;

    async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        await updateProfileAvatar(file);
    }

    return (
        <>
            <div className="max-w-2xl mx-auto px-4 pt-20 w-full pb-6">
                <div className="bg-base-200 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold ">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img
                                src={user?.avatar || '/avatar.png'}
                                alt=""
                                className="size-32 rounded-full object-cover border-4 "
                            />
                            <label
                                htmlFor="avatar-upload"
                                className={clsx(
                                    'absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200',
                                    {
                                        'animate-pulse pointer-events-none': isLoading,
                                    },
                                )}
                            >
                                <Camera className="w-5 h-5 text-base-200" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept={ALLOWED_IMAGE_FORMATS.join(', ')}
                                    onChange={handleFileUpload}
                                    disabled={isLoading}
                                />
                            </label>
                        </div>
                        <div>
                            <p className="text-xs">
                                {isLoading
                                    ? 'Uploading...'
                                    : 'Click the camera icon to update your photo'}
                            </p>
                            <div className="text-sm opacity-80">PNG or JPEG only, max 5MB</div>
                            {error && <div className="text-xs text-error mt-1">{error}</div>}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full name
                            </div>
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border">
                                {user.fullName}
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email address
                            </div>
                            <p className="px-4 py-2.5 bg-base-300 rounded-lg border">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 bg-base-300 rounded-xl p-6">
                        <h2 className="text-lg font-medium  mb-4">Account information</h2>
                        <div className="text-sm">
                            <div className="flex items-center justify-between py-2">
                                <span>Member since</span>
                                <span>{user.createdAt.split('T')[0]}</span>
                            </div>
                            <div className="divider my-0"></div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account status</span>
                                <span className="text-success">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
