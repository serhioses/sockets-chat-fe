import { PropsWithChildren } from 'react';
import { FieldValues, FormProvider, SubmitHandler, UseFormReturn } from 'react-hook-form';

type TFormProps<T extends FieldValues> = PropsWithChildren & {
    methods: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
};

export function Form<T extends FieldValues>({ methods, onSubmit, children }: TFormProps<T>) {
    return (
        <FormProvider {...methods}>
            <form
                noValidate={true}
                onSubmit={(e) => {
                    void methods.handleSubmit(onSubmit)(e);
                }}
            >
                {children}
            </form>
        </FormProvider>
    );
}
