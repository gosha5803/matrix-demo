// src/features/rooms/components/RoomCard.tsx
import { NotificationCountType, Room } from 'matrix-js-sdk'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils' // Утилита shadcn для объединения классов

type RoomCardProps = {
    room: Room
    isActive: boolean
    onClick: () => void
}

// TODO почистить редактирование и лишний функционал
// TODO баг количества непрочитанных сообщений
// TODO'шки
export const RoomCard = ({
    room,
    isActive,
    onClick
}: RoomCardProps) => {
    const roomName =
        room.name || room.getCanonicalAlias() || 'Без названия'
    const initials = roomName.slice(0, 2).toUpperCase()

    // Получаем количество непрочитанных сообщений (включая упоминания)
    const unreadCount = room.getUnreadNotificationCount(
        NotificationCountType.Total
    )
    const highlightCount = room.getUnreadNotificationCount(
        NotificationCountType.Highlight
    )

    // Получаем последнее сообщение для превью
    // TODO вынести отельно? Что будет, если последнее событие не сообщение 'm.room.message', но предпоследнее сообщение
    const timeline = room.getLiveTimeline().getEvents()
    const lastEvent = timeline[timeline.length - 1]
    let lastMessagePreview = 'Нет сообщений'

    if (lastEvent && lastEvent.getType() === 'm.room.message') {
        const sender =
            lastEvent.getSender() === room.client.getUserId()
                ? 'Вы'
                : lastEvent
                      .getSender()
                      ?.replace(/^@/, '')
                      .split(':')[0]
        const content = lastEvent.getContent().body
        lastMessagePreview = `${sender}: ${content}`
    }

    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors',
                isActive
                    ? 'bg-primary/10 border-l-4 border-primary shadow-sm'
                    : 'hover:bg-muted/50 border-l-4 border-transparent'
            )}
        >
            <Avatar className='h-10 w-10 flex-shrink-0'>
                <AvatarFallback className='bg-primary/10 text-primary text-xs'>
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                    <span className='font-semibold text-sm truncate'>
                        {roomName}
                    </span>
                    {(unreadCount > 0 || highlightCount > 0) && (
                        <Badge
                            variant={
                                highlightCount > 0
                                    ? 'destructive'
                                    : undefined
                            }
                            className='h-5 min-w-[20px] px-1.5 flex items-center justify-center text-xs'
                        >
                            {highlightCount > 0
                                ? highlightCount
                                : unreadCount}
                        </Badge>
                    )}
                </div>
                <p className='text-xs text-muted-foreground truncate'>
                    {lastMessagePreview}
                </p>
            </div>
        </button>
    )
}
