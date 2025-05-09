import { render, renderHook, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { Form } from '@/components/form/Form';
import { FormInput } from '@/components/form/FormInput';
import userEvent from '@testing-library/user-event';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

describe('text input', () => {
    it('should render a form with a text input', async () => {
        const { result } = renderHook(() => useForm());
        render(
            <Form methods={result.current} onSubmit={() => null}>
                <FormInput name="username" />
            </Form>,
        );

        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue('');

        await userEvent.type(input, 'new value');
        expect(input).toHaveValue('new value');
    });

    const formSchema = z.object({
        username: z.string({ message: 'username required' }).trim().min(1, 'min 1').max(5, 'max 5'),
    });
    it('should show correct error', async () => {
        const { result } = renderHook(() => useForm({ resolver: zodResolver(formSchema) }));
        render(
            <Form methods={result.current} onSubmit={() => null}>
                <FormInput name="username" />
                <button type="submit">Submit</button>
            </Form>,
        );

        const input = screen.getByRole('textbox');
        const button = screen.getByRole('button');

        await userEvent.click(button);
        expect(screen.getByText('username required')).toBeInTheDocument();
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'username-error');

        await userEvent.type(input, ' ');
        expect(screen.getByText('min 1')).toBeInTheDocument();

        await userEvent.clear(input);
        await userEvent.type(input, 'too long');
        expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot('"max 5"');

        await userEvent.clear(input);
        await userEvent.type(input, 'Name');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});

describe('file input', () => {
    it('should render a form with a file input', () => {
        const { result } = renderHook(() => useForm());
        render(
            <Form methods={result.current} onSubmit={() => null}>
                <FormInput name="file" type="file" label="file" id="file" accept="image/png" />
            </Form>,
        );

        const fileInput = screen.getByLabelText('file');
        expect(fileInput).toHaveAttribute('type', 'file');
        expect(fileInput).toHaveAttribute('accept', 'image/png');
        expect(screen.getByText('file')).toBeInTheDocument();
    });

    const formSchema = z.object({
        file: z.instanceof(File, { message: 'upload file' }),
    });
    it('should properly handle file input', async () => {
        const { result } = renderHook(() => useForm({ resolver: zodResolver(formSchema) }));
        render(
            <Form methods={result.current} onSubmit={() => null}>
                <FormInput name="file" type="file" label="file" id="file" accept="image/png" />
                <button type="submit">Submit</button>
            </Form>,
        );

        const button = screen.getByRole('button');
        const fileInput: HTMLInputElement = screen.getByLabelText('file');
        await userEvent.click(button);

        expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot('"upload file"');

        const uploadFile = new File([''], 'image.png', { type: 'image/png' });
        await userEvent.upload(fileInput, uploadFile);

        expect(fileInput.files?.length).toBe(1);
        expect(fileInput.files?.[0].type).toBe('image/png');
        expect(fileInput.files?.[0].name).toBe('image.png');
    });
});
