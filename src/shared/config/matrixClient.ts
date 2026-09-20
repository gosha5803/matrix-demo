import {
    ClientEvent,
    createClient,
    MatrixClient,
    SyncState
} from 'matrix-js-sdk'

const HOMESERVER_URL = import.meta.env.VITE_SERVER_URL

// Временный клиент для логина (без токена)
let tempClient: MatrixClient | null = null
let matrixClient: MatrixClient | null = null

/**
 * Логин по username/password
 */
export const loginWithPassword = async (
    username: string,
    password: string
) => {
    // 1. Создаём временный клиент, если его нет
    if (!tempClient) {
        tempClient = createClient({ baseUrl: HOMESERVER_URL })
    }

    // 2. Запрашиваем токен
    const response = await tempClient.loginRequest({
        type: 'm.login.password',
        identifier: {
            type: 'm.id.user',
            user: username
        },
        password: password,
        initial_device_display_name: 'Matrix Demo Web'
    })

    // 3. Сохраняем сессию (можно в localStorage)
    saveSession({
        userId: response.user_id,
        accessToken: response.access_token,
        deviceId: response.device_id
    })

    // 4. Создаём основной клиент
    matrixClient = createClient({
        baseUrl: HOMESERVER_URL,
        accessToken: response.access_token,
        userId: response.user_id,
        deviceId: response.device_id
    })

    return response
}

/**
 * Запуск клиента после логина
 */
export const startMatrixClient = () => {
    if (!matrixClient)
        throw new Error('Matrix client not initialized')

    matrixClient.startClient({ initialSyncLimit: 10 })

    matrixClient.on(ClientEvent.Sync, (state, prevState) => {
        console.log(`Sync: ${prevState} -> ${state}`)

        if (state === SyncState.Prepared) {
            console.log(
                'Client ready. Rooms:',
                matrixClient?.getRooms().length
            )
        }
    })
}

/**
 * Получить текущий клиент
 */
export const getMatrixClient = () => matrixClient

// --- Сохранение сессии (localStorage) ---
const SESSION_KEY = 'matrix-auth'

interface Session {
    userId: string
    accessToken: string
    deviceId: string
}

const saveSession = (session: Session) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const loadSession = (): Session | null => {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}

/**
 * Восстановление клиента из сохранённой сессии (при перезагрузке страницы)
 */
export const restoreClient = () => {
    const session = loadSession()
    if (!session) return null

    matrixClient = createClient({
        baseUrl: HOMESERVER_URL,
        accessToken: session.accessToken,
        userId: session.userId,
        deviceId: session.deviceId
    })

    return matrixClient
}

export const isAuthenticated = (): boolean => {
    return getMatrixClient() !== null || loadSession() !== null
}
