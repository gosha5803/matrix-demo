import { LoginModal } from '@/feature/login/LoginModal'
import { CreateRoomModal } from '@/feature/rooms/ui/CreateRoomModal'
import { Loader2 } from 'lucide-react'
import { useMatrix } from '../providers'
import { UserMenu } from '@/feature/login/UserMenu'

export const Header = () => {
    const { isAuthenticated, isLoading } = useMatrix()

    return (
        <header className='sticky top-0 z-50 w-full px-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className='container flex h-16 items-center m-auto justify-between'>
                {/* Логотип */}
                <div className='flex items-center gap-2'>
                    <span className='text-lg font-bold'>
                        Matrix Demo
                    </span>
                </div>

                {/* Пользовательские действия */}
                <div className='flex items-center gap-2'>
                    {/* Три состояния: загрузка, не авторизован, авторизован */}
                    {isLoading ? (
                        <div className='flex items-center gap-2 px-3'>
                            <Loader2 className='h-4 w-4 animate-spin' />
                        </div>
                    ) : isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <LoginModal />
                    )}
                </div>
            </div>
        </header>
    )
}
