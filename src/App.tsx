import React from 'react'

import RoofCalculator from './components/RoofCalculator/RoofCalculator'

import './styles/global.css'

export default function App(): React.JSX.Element {
    return (
        <div className='rc-widget'>
            <h1>Калькулятор кровли</h1>
            <RoofCalculator />
        </div>
    )
}
