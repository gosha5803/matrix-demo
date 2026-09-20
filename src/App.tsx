import { useEffect } from 'react'
import './App.css'

import {
    restoreClient,
    startMatrixClient
} from './shared/config/matrixClient'
import { Header } from './components/layout/header'
import { MatrixProvider } from './components/providers'
import { ChatPage } from './pages/ChatPage'

function App() {
    useEffect(() => {
        const client = restoreClient()
        if (client) {
            startMatrixClient()
        }
    }, [])

    return (
        <MatrixProvider>
            <Header />
            <ChatPage />
        </MatrixProvider>
    )
}

export default App
