import { useState, useRef, type KeyboardEvent } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useSendMessage } from '../hooks/useSendMessage'
import { MatrixClient, Room } from 'matrix-js-sdk'

type MessageInputProps = {
    client: MatrixClient | null
    room: Room | null | undefined
}

export const MessageInput = ({ client, room }: MessageInputProps) => {
    const [message, setMessage] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { sendMessage, isSending, error, clearError } =
        useSendMessage(client, room)

    const isSendingDisabled =
        !client || !room || !message.trim() || isSending

    const handleSend = async () => {
        if (!message.trim() || isSending) return

        const success = await sendMessage(message)

        if (success) {
            setMessage('')
            // Возвращаем фокус на textarea после отправки
            textareaRef.current?.focus()
        }
    }

    const handleEnterKeyDown =
        (cb: VoidFunction) =>
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                cb()
            }
        }

    const handleChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessage(e.target.value)
        if (error) clearError()
    }

    if (!room) {
        return null
    }

    return (
        <div className='flex items-end gap-2 p-2 border rounded-lg bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all'>
            <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleChange}
                onKeyDown={handleEnterKeyDown(handleSend)}
                placeholder='Напишите сообщение...'
                className='min-h-[40px] max-h-[200px] resize-none border-0 p-2 focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 '
                disabled={isSending}
                autoFocus
            />

            <Button
                onClick={handleSend}
                disabled={isSendingDisabled}
                size='icon'
                className='h-9 w-9 flex-shrink-0'
            >
                {isSending ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                    <Send className='h-4 w-4' />
                )}
            </Button>
        </div>
    )
}
