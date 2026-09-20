'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError
} from '@/components/ui/field'
import { useLogin } from './useLogin'
import { loginSchema, type LoginValues } from './schema'

type Props = {
    onSuccess?: VoidFunction
}

export const LoginForm = ({ onSuccess }: Props) => {
    const { loading, login } = useLogin()

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: '',
            password: ''
        }
    })

    async function onSubmit(values: LoginValues) {
        login(values)

        if (onSuccess) {
            onSuccess()
        }

        form.reset()
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-6'
        >
            {/* Имя пользователя */}
            <Controller
                name='username'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Имя пользователя
                        </FieldLabel>
                        <Input
                            id={field.name}
                            placeholder='alice'
                            autoComplete='username'
                            aria-invalid={fieldState.invalid}
                            disabled={loading}
                            {...field}
                        />
                        <FieldDescription>
                            Локальная часть MXID без собачки и домена.
                            Например, <code>alice</code> для{' '}
                            <code>@alice:localhost</code>.
                        </FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* Пароль */}
            <Controller
                name='password'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Пароль
                        </FieldLabel>
                        <Input
                            id={field.name}
                            type='password'
                            autoComplete='current-password'
                            aria-invalid={fieldState.invalid}
                            disabled={loading}
                            {...field}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button
                type='submit'
                className='w-full'
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Вход...
                    </>
                ) : (
                    'Войти'
                )}
            </Button>
        </form>
    )
}
