import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { LoginForm } from './LoginForm'

export const LoginModal = () => {
    const [open, setOpen] = useState(false)

    const close = () => setOpen(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>Войти</Button>} />

            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Вход в Matrix</DialogTitle>
                    <DialogDescription>
                        Введите данные вашей учётной записи Matrix.
                    </DialogDescription>
                </DialogHeader>

                <LoginForm onSuccess={close} />
            </DialogContent>
        </Dialog>
    )
}
