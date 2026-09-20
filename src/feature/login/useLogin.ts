import { startMatrixClient } from '@/shared/config'
import { useState } from 'react'
import type { LoginValues } from './schema'
import { useMatrix } from '@/components/providers'

export const useLogin = () => {
    const { login: loginWithPassword } = useMatrix()
    const [loading, SetLoading] = useState(false)

    async function login(values: LoginValues) {
        SetLoading(true)
        try {
            await loginWithPassword(values.username, values.password)
            startMatrixClient() // запускаем синхронизацию
        } catch (error) {
            // TODO handle error
            console.error('Login failed:', error)
        } finally {
            SetLoading(false)
        }
    }

    return { login, loading }
}
