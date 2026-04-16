import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'

import './styles/widget.css'

function mount() {
    const container = document.getElementById('roof-calc')
    if (!container) {
        console.warn('[RoofCalc] Элемент #roof-calc не найден на странице')
        return
    }
    createRoot(container).render(
        <StrictMode>
            <App />
        </StrictMode>
    )
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
} else {
    mount()
}
