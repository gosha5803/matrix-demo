import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useMatrix } from '@/components/providers'

export const UserMenu = () => {
    const { client, logout, isLoggingOut } = useMatrix()

    if (!client) return null

    const userId = client.getUserId() || ''

    // Извлекаем localpart из @user:server.com -> user
    const displayName = userId.replace(/^@/, '').split(':')[0]
    const initials = displayName.slice(0, 2).toUpperCase()

    const handleLogout = async () => {
        await logout()
        // Можно добавить редирект на главную
        window.location.reload()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant='ghost'
                        className='relative h-9 w-9 rounded-full'
                    >
                        <Avatar className='h-9 w-9'>
                            <AvatarFallback className='bg-primary/10 text-primary'>
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                }
            />
            <DropdownMenuContent className='w-40' align='start'>
                <DropdownMenuGroup>
                    <DropdownMenuLabel className='font-normal'>
                        <div className='flex flex-col space-y-1'>
                            <p className='text-sm font-medium leading-none'>
                                {displayName}
                            </p>
                            <p className='text-xs leading-none text-muted-foreground'>
                                {userId}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut} // Блокируем кнопку во время выхода
                    className='cursor-pointer text-red-600 focus:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {/* Показываем спиннер вместо иконки, если идет выход */}
                    {isLoggingOut ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                        <LogOut className='mr-2 h-4 w-4' />
                    )}
                    <span>{isLoggingOut ? 'Выход...' : 'Выйти'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
