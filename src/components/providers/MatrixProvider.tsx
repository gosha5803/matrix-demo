import {
    createContext,
    useContext,
    useEffect,
    useState,
    type PropsWithChildren
} from 'react'
import { createClient, MatrixClient } from 'matrix-js-sdk'
import { useAutoAcceptDM } from '@/feature/rooms'

const HOMESERVER_URL = import.meta.env.VITE_SERVER_URL
const SESSION_KEY = 'matrix-auth'

interface Session {
    userId: string
    accessToken: string
    deviceId: string
}

interface MatrixContextType {
    client: MatrixClient | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password: string) => Promise<void>
    logout: () => void
    isLoggingOut: boolean
}

const MatrixContext = createContext<MatrixContextType | undefined>(
    undefined
)

export const MatrixProvider = ({ children }: PropsWithChildren) => {
    const [client, setClient] = useState<MatrixClient | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    useAutoAcceptDM(client)

    // 1. Восстановление сессии при загрузке приложения
    useEffect(() => {
        const sessionStr = localStorage.getItem(SESSION_KEY)
        // TODO в хук
        if (sessionStr) {
            try {
                const session: Session = JSON.parse(sessionStr)
                const restoredClient = createClient({
                    baseUrl: HOMESERVER_URL,
                    accessToken: session.accessToken,
                    userId: session.userId,
                    deviceId: session.deviceId
                })

                setClient(restoredClient)
                setIsAuthenticated(true)
                restoredClient.startClient({ initialSyncLimit: 20 })
            } catch (e) {
                console.error('Failed to restore session', e)
                localStorage.removeItem(SESSION_KEY)
            }
        }
        setIsLoading(false)
    }, [])

    // 2. Функция логина
    const login = async (username: string, password: string) => {
        // Временно создаем клиент для запроса
        const tempClient = createClient({ baseUrl: HOMESERVER_URL })

        const response = await tempClient.loginRequest({
            type: 'm.login.password',
            identifier: { type: 'm.id.user', user: username },
            password,
            initial_device_display_name: 'Matrix Demo Web'
        })

        // Сохраняем сессию
        // TODO работу с localStorgae вынести
        const session: Session = {
            userId: response.user_id,
            accessToken: response.access_token,
            deviceId: response.device_id
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))

        // Создаем и сохраняем основной клиент
        const newClient = createClient({
            baseUrl: HOMESERVER_URL,
            accessToken: session.accessToken,
            userId: session.userId,
            deviceId: session.deviceId
        })

        setClient(newClient)
        setIsAuthenticated(true)
        newClient.startClient({ initialSyncLimit: 20 })
    }

    const logout = async () => {
        setIsLoggingOut(true) // Начинаем загрузку

        try {
            if (client) {
                // Пытаемся корректно сообщить серверу о выходе.
                // Если упадет с ошибкой, мы это ловим, но не прерываем выполнение.
                await client.logout().catch((e) => {
                    console.warn(
                        'Не удалось выйти на сервере, выполняем локальный выход',
                        e
                    )
                })

                // Останавливаем фоновую синхронизацию
                client.stopClient()
            }
        } finally {
            // Этот блок выполнится ВСЕГДА, успешно или с ошибкой

            // 1. Чистим хранилище
            localStorage.removeItem(SESSION_KEY)

            // 2. Сбрасываем состояние React (это автоматически обновит isAuthenticated)
            setClient(null)
            setIsAuthenticated(false)

            // 3. Завершаем загрузку
            setIsLoggingOut(false)
        }
    }

    return (
        <MatrixContext.Provider
            value={{
                client,
                isAuthenticated,
                isLoading,
                // TODO  в initialLoading бы
                login,
                isLoggingOut,
                logout
            }}
        >
            {children}
        </MatrixContext.Provider>
    )
}

// контекст
export const useMatrix = () => {
    const context = useContext(MatrixContext)

    if (!context)
        throw new Error(
            'useMatrix must be used within MatrixProvider'
        )

    return context
}

// TODO ревью форм, всего флоу там
// Может функции провайдеры повыносить в хуки?
