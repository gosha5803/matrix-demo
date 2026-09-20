import { useEffect, useState, type FC } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CreateRoomForm } from './CreateRoomForm'
import { Pencil } from 'lucide-react'
import { Room } from 'matrix-js-sdk'
import { useEditRoom } from '../hooks/useEditRoom'
import type { CreateRoomFormValues } from '../schema'

type Props = {
    room: Room
}

export const EditRoomModal: FC<Props> = ({ room }) => {
    const [open, setOpen] = useState(false)
    const { editRoom, isRoomEditing } = useEditRoom()

    useEffect(() => {
        console.log(room)
    }, [room])

    const close = () => {
        setOpen(false)
    }

    const onFinish = async (fields: CreateRoomFormValues) => {
        console.log(fields)
        await editRoom(room, fields)
        close()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
                render={
                    <Button variant='outline'>
                        <Pencil />
                    </Button>
                }
            />

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Новая комната</DialogTitle>
                </DialogHeader>

                <CreateRoomForm
                    isEditing
                    onFinish={onFinish}
                    isLoading={isRoomEditing}
                    // @ts-ignore
                    initialValues={{ roomName: room.name }}
                />
            </DialogContent>
        </Dialog>
    )
}

//
