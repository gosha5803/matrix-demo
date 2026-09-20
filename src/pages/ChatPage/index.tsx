// src/pages/ChatPage.tsx
import { useState } from 'react'
import { useMatrix } from '../../components/providers'
import { EditRoomModal, SideBar } from '../../feature/rooms'
import { MessagesBox } from '@/feature/messages'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const ChatPage = () => {
    const { client } = useMatrix()
    const [activeRoomId, setActiveRoomId] = useState<string | null>(
        null
    )

    const activeRoom = activeRoomId
        ? client?.getRoom(activeRoomId)
        : null
    const currentUserId = client?.getUserId() || null

    return (
        <div className='flex h-[calc(100vh-4rem)]'>
            <SideBar
                activeRoomId={activeRoomId}
                onRoomSelect={setActiveRoomId}
            />

            <main className='flex-1 flex flex-col bg-muted/20'>
                {/* TODO Вынести в отдельный компонент  */}
                {activeRoom && (
                    <div className='flex justify-between border-b bg-background p-4'>
                        <h1 className='text-lg font-semibold'>
                            {activeRoom.name ||
                                activeRoom.getCanonicalAlias() ||
                                'Без названия'}
                        </h1>
                        <EditRoomModal room={activeRoom} />
                    </div>
                )}

                <MessagesBox
                    client={client}
                    room={activeRoom}
                    currentUserId={currentUserId}
                />
            </main>
        </div>
    )
}
