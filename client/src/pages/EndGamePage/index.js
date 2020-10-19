import React from 'react'
import { Button } from 'react-bootstrap'
import LosePage from './components/losePage'
import WinPage from './components/winPage'

function endGamePage() {
    const status = 'lose'
    return (
        <div className="container">
            {status === 'win'?<WinPage />:<LosePage />}
        </div>
    )
}

export default endGamePage