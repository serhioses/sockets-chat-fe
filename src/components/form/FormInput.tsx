import { InputHTMLAttributes } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

type TFormInputProps = {
    name: string;
    label?: string;
    id?: string;
} & Pick<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export function FormInput({ name, label, id, type = 'text' }: TFormInputProps) {
    const { control } = useFormContext();

    return (
        <div className="mb-4">
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

                    return (
                        <>
                            <input
                                id={id}
                                type={type}
                                className={clsx('input w-full', { 'input-error': !!error })}
                                {...field}
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                value={field.value ?? ''}
                            />
                            {error && (
                                <div className="text-error text-sm pl-2">{error.message}</div>
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
}
