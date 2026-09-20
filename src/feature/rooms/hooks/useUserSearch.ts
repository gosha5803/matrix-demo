import { useState, useCallback } from 'react'
import { MatrixClient } from 'matrix-js-sdk'
import { debounce } from '@/shared/lib'

type UserResult = {
    user_id: string
    display_name?: string
}

export const useUserSearch = (client: MatrixClient | null) => {
    const [results, setResults] = useState<UserResult[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const search = useCallback(
        debounce(async (term: string) => {
            if (!client || term.length < 2) {
                setResults([])
                return
            }

            setIsSearching(true)
            try {
                // Стандартный метод поиска в каталоге пользователей
                const response = await client.searchUserDirectory({
                    term: term,
                    limit: 20
                })
                setResults(response.results || [])
            } catch (error) {
                console.error('Ошибка поиска пользователей:', error)
                setResults([])
            } finally {
                setIsSearching(false)
            }
        }, 500),
        [client]
    )

    return { results, isSearching, search }
}
