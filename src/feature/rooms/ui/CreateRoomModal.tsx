import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateRoomForm } from './CreateRoomForm'
import { Plus } from 'lucide-react'
import { useCreateRoom } from '../hooks/useCreateRoom'
import type { CreateRoomFormValues } from '../schema'

export const CreateRoomModal = () => {
    const [open, setOpen] = useState(false)
    const { createRoom, isLoading, error } = useCreateRoom()

    const close = () => setOpen(false)

    const onFinish = async ({
        targetUserId
    }: CreateRoomFormValues) => {
        const room = await createRoom(targetUserId)
        close()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant='outline'>
                        <Plus />
                    </Button>
                }
            />

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Новая комната</DialogTitle>
                </DialogHeader>

                <CreateRoomForm
                    error={error}
                    onFinish={onFinish}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    )
}

//
