import z from 'zod'

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, { message: 'Введите имя пользователя.' })
        .max(255, { message: 'Слишком длинное имя пользователя.' }),
    password: z
        .string()
        .min(1, { message: 'Введите пароль.' })
        .max(255, { message: 'Слишком длинный пароль.' })
})

export type LoginValues = z.infer<typeof loginSchema>
