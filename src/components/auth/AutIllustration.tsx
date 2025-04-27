import clsx from 'clsx';

type TAuthIllustrationProps = {
    title: string;
    text: string;
};

export function AuthIllustration({ title, text }: TAuthIllustrationProps) {
    return (
        <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
            <div className="max-w-md text-center">
                <div className="grid grid-cols-3 gap-3 mb-8">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className={clsx('aspect-square rounded-2xl bg-primary/10', {
                                'animate-pulse': i % 2 === 0,
                            })}
                        />
                    ))}
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <p className="text-base-content/60">{text}</p>
            </div>
        </div>
    );
}
