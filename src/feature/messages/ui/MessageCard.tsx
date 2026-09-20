import { MatrixEvent } from 'matrix-js-sdk'
import { cn } from '@/lib/utils'

type MessageCardProps = {
    event: MatrixEvent
    currentUserId: string | null
}

export const MessageCard = ({
    event,
    currentUserId
}: MessageCardProps) => {
    const sender = event.getSender() || 'Unknown'
    const isOwnMessage = sender === currentUserId

    // Добавляем fallback на случай, если body пустой (например, системные события)
    const content = event.getContent().body || ''

    const timestamp = new Date(event.getTs()).toLocaleTimeString(
        'ru-RU',
        {
            hour: '2-digit',
            minute: '2-digit'
        }
    )

    const senderDisplayName = sender.replace(/^@/, '').split(':')[0]

    return (
        <div
            className={cn(
                'flex flex-col max-w-[70%]',
                isOwnMessage
                    ? 'ml-auto items-end'
                    : 'mr-auto items-start'
            )}
        >
            {!isOwnMessage && (
                <span className='text-xs text-muted-foreground mb-1 px-1'>
                    {senderDisplayName}
                </span>
            )}

            {/* Пузырь сообщения */}
            <div
                className={cn(
                    'rounded-lg px-3 py-2 shadow-sm',
                    isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                )}
            >
                <p className='text-base whitespace-pre-wrap break-words leading-relaxed'>
                    {content}
                </p>

                {/* Время отправки */}
                <span
                    className={cn(
                        'text-[10px] mt-1 block text-right',
                        isOwnMessage
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                    )}
                >
                    {timestamp}
                </span>
            </div>
        </div>
    )
}
