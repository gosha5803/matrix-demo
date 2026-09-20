// src/features/rooms/components/UserSearchCombobox.tsx
import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

type User = {
    id: string
    displayName: string
}

type Props = {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

export const UserSearchCombobox = ({
    value,
    onChange,
    disabled
}: Props) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([])

    // Загружаем пользователей при открытии И при изменении поискового запроса
    useEffect(() => {
        if (!open) return // Не загружаем, если комбобокс закрыт

        const timer = setTimeout(
            async () => {
                setIsLoading(true)
                try {
                    // === ЗАМЕНИТЕ НА РЕАЛЬНЫЙ ЗАПРОС К ВАШЕМУ БЭКЕНДУ ===
                    // const res = await fetch(`/api/users?search=${searchTerm}`)
                    // const data = await res.json()
                    // setUsers(data)

                    // Демо: имитируем загрузку всех пользователей
                    const allUsers: User[] = [
                        {
                            id: '@demo:localhost',
                            displayName: 'Demo User'
                        },
                        {
                            id: '@goga:localhost',
                            displayName: 'Goga'
                        },
                        {
                            id: '@admin:localhost',
                            displayName: 'Admin'
                        }
                    ]

                    // Фильтруем только если есть поисковый запрос
                    const filtered = searchTerm
                        ? allUsers.filter(
                              (u) =>
                                  u.id
                                      .toLowerCase()
                                      .includes(
                                          searchTerm.toLowerCase()
                                      ) ||
                                  u.displayName
                                      .toLowerCase()
                                      .includes(
                                          searchTerm.toLowerCase()
                                      )
                          )
                        : allUsers // ← КЛЮЧЕВОЕ: без запроса показываем ВСЕХ

                    setUsers(filtered)
                } catch (error) {
                    console.error(
                        'Ошибка загрузки пользователей:',
                        error
                    )
                } finally {
                    setIsLoading(false)
                }
            },
            searchTerm ? 300 : 0
        ) // Мгновенно при открытии, с задержкой при вводе

        return () => clearTimeout(timer)
    }, [open, searchTerm]) // ← Зависимость от open!

    const selectedUser = users.find((u) => u.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={() => (
                    <Button
                        variant='outline'
                        role='combobox'
                        aria-expanded={open}
                        className='w-full justify-between font-normal'
                        disabled={disabled}
                    >
                        {selectedUser ? (
                            <span className='truncate'>
                                {selectedUser.displayName}{' '}
                                <span className='text-muted-foreground text-xs'>
                                    ({selectedUser.id})
                                </span>
                            </span>
                        ) : (
                            <span className='text-muted-foreground'>
                                Выберите пользователя...
                            </span>
                        )}
                        <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                )}
            />

            <PopoverContent className='w-[300px] p-0' align='start'>
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder='Поиск по имени...'
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList>
                        {isLoading ? (
                            <div className='p-4 text-center text-sm text-muted-foreground'>
                                <Loader2 className='mx-auto h-4 w-4 animate-spin mb-2' />
                                Загрузка...
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>
                                    Пользователь не найден
                                </CommandEmpty>
                                <CommandGroup heading='Пользователи'>
                                    {users.map((user) => (
                                        <CommandItem
                                            key={user.id}
                                            value={user.id}
                                            onSelect={(
                                                currentValue
                                            ) => {
                                                onChange(
                                                    currentValue ===
                                                        value
                                                        ? ''
                                                        : currentValue
                                                )
                                                setOpen(false)
                                                setSearchTerm('')
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === user.id
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            <div className='flex flex-col'>
                                                <span className='font-medium'>
                                                    {user.displayName}
                                                </span>
                                                <span className='text-xs text-muted-foreground'>
                                                    {user.id}
                                                </span>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
