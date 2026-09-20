import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError
} from '@/components/ui/field'
import {
    createRoomSchema,
    type CreateRoomFormValues
} from '../schema'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

interface CreateRoomFormProps {
    onError?: (error: unknown) => void
    onFinish: (values: CreateRoomFormValues) => void
    initialValues?: Partial<CreateRoomFormValues>
    isEditing?: boolean
    isLoading: boolean
    error: string | null
}
export const CreateRoomForm = ({
    onFinish,
    initialValues,
    isEditing = false,
    isLoading,
    error
}: CreateRoomFormProps) => {
    const form = useForm<CreateRoomFormValues>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            targetUserId: ''
        }
    })

    async function onSubmit(values: CreateRoomFormValues) {
        const roomId = await onFinish(values)
        form.reset()
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
        >
            {error && (
                <Alert variant='destructive'>
                    <AlertCircleIcon />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Controller
                name='targetUserId'
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            Matrix ID пользователя
                        </FieldLabel>
                        <Input
                            id={field.name}
                            placeholder='@goga:localhost'
                            disabled={isLoading}
                            {...field}
                        />
                        <FieldDescription>
                            Введите полный ID пользователя, например{' '}
                            <code>@goga:localhost</code>
                        </FieldDescription>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            <Button
                type='submit'
                className='w-full'
                disabled={isLoading}
            >
                {isLoading ? 'Создание чата...' : 'Начать чат'}
            </Button>
        </form>
    )
}
