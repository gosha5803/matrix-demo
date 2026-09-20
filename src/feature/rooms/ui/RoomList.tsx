// src/features/rooms/components/RoomList.tsx
import { Room } from 'matrix-js-sdk'
import { RoomCard } from './RoomCard'
import { ScrollArea } from '@/components/ui/scroll-area'

type RoomListProps = {
    rooms: Room[]
    activeRoomId: string | null
    onRoomSelect: (roomId: string) => void
}

export const RoomList = ({
    rooms,
    activeRoomId,
    onRoomSelect
}: RoomListProps) => {
    if (rooms.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full text-center p-4 text-muted-foreground'>
                <p className='text-sm'>У вас пока нет комнат.</p>
                <p className='text-xs mt-1'>
                    Создайте новую или дождитесь приглашения.
                </p>
            </div>
        )
    }

    return (
        <ScrollArea className='h-[calc(100vh-8rem)]'>
            {/* Высота минус высота Header */}
            {/* TODO протестить скролл */}
            <div className='p-2 space-y-1'>
                {rooms.map((room) => (
                    <RoomCard
                        key={room.roomId}
                        room={room}
                        isActive={activeRoomId === room.roomId}
                        onClick={() => onRoomSelect(room.roomId)}
                    />
                ))}
            </div>
        </ScrollArea>
    )
}
