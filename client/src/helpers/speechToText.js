import React from 'react'

export function micOn() {
    const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
    const mic = new SpeechRecognition()
    
    mic.continuous = true
    mic.interimResults = true
    mic.lang = 'id-ID'
    mic.start()
    mic.onend = () => {
        console.log('continue...')
        mic.start()
    }
}