// src/features/rooms/components/SideBar.tsx
import { useMatrix } from '@/components/providers'
import { RoomList } from './RoomList'
import { useMatrixRooms } from '../hooks/useMatrixRooms'
import { Button } from '@/components/ui/button'
import { CreateRoomModal } from './CreateRoomModal'
import type { Dispatch, SetStateAction } from 'react'

type SideBarProps = {
    activeRoomId: string | null
    onRoomSelect: (roomId: string) => void
}

export const SideBar = ({
    activeRoomId,
    onRoomSelect
}: SideBarProps) => {
    const { client, isAuthenticated, isLoading } = useMatrix()

    // Получаем актуальный список комнат
    const rooms = useMatrixRooms(isAuthenticated ? client : null)

    // Если не авторизован или идет начальная загрузка клиента, не рендерим сайдбар
    if (!isAuthenticated || isLoading) {
        return null
    }

    return (
        <aside className='w-80 border-r bg-background flex flex-col h-[calc(100vh-4rem)]'>
            <div className='p-4 border-b flex items-center justify-between'>
                <h2 className='font-semibold text-lg'>Чаты</h2>

                <CreateRoomModal />
            </div>

            <RoomList
                rooms={rooms}
                activeRoomId={activeRoomId}
                onRoomSelect={onRoomSelect}
            />
        </aside>
    )
}
