import { z } from 'zod'

const matrixIdRegex = /^@[^:]+$/

export const createRoomSchema = z.object({
    targetUserId: z
        .string()
        .min(1, 'Введите ID пользователя')
        .regex(matrixIdRegex, 'Неверный формат. Пример: @goga')
})

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>
