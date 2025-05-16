import { InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

type TFormInputProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label?: string;
    className?: string;
    wrapperClassName?: string;
};

export function FormInput({
    name,
    className,
    wrapperClassName,
    label,
    id,
    type = 'text',
    ...rest
}: TFormInputProps) {
    const { control } = useFormContext();

    return (
        <div className={clsx('mb-4', wrapperClassName)}>
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                </label>
            )}
            <Controller
                control={control}
                name={name}
                render={({ field, fieldState }) => {
                    const { error } = fieldState;

                    if (type === 'file') {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
                        const { value, ...fieldProps } = field;

                        return (
                            <>
                                <input
                                    id={id}
                                    type={type}
                                    className={clsx(
                                        'input w-full',
                                        { 'input-error': !!error },
                                        className,
                                    )}
                                    {...rest}
                                    {...fieldProps}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] ?? undefined;
                                        field.onChange(file);
                                    }}
                                />
                                {error && (
                                    <div className="text-error text-sm pl-2" role="alert">
                                        {error.message}
                                    </div>
                                )}
                            </>
                        );
                    }

                    return (
                        <>
                            <input
                                id={id}
                                type={type}
                                className={clsx(
                                    'input w-full',
                                    { 'input-error': !!error },
                                    className,
                                )}
                                {...rest}
                                {...field}
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                value={field.value ?? ''}
                                aria-invalid={error ? true : undefined}
                                aria-describedby={error ? `${name}-error` : undefined}
                            />
                            {error && (
                                <div
                                    className="text-error text-sm pl-2"
                                    role="alert"
                                    data-error
                                    id={`${name}-error`}
                                >
                                    {error.message}
                                </div>
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
}
