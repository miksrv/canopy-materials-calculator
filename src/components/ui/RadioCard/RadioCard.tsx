import { type ReactNode } from 'react'

import styles from './RadioCard.module.css'

interface RadioCardProps {
    label: string
    /** URL string or SVG ReactNode */
    image?: string | ReactNode
    selected: boolean
    onClick: () => void
}

/**
 * Selectable card for choosing a roof type or material.
 * Displays an optional image (URL or inline SVG) and a label below.
 */
export default function RadioCard({ label, image, selected, onClick }: RadioCardProps): React.JSX.Element {
    return (
        <div
            className={`${styles.card} ${selected ? styles.selected : ''}`}
            onClick={onClick}
            role='radio'
            aria-checked={selected}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick()
                }
            }}
        >
            {image !== undefined && (
                <div className={styles.imageWrapper}>
                    {typeof image === 'string' ? (
                        <img
                            src={image}
                            alt={label}
                        />
                    ) : (
                        image
                    )}
                </div>
            )}
            <span className={styles.label}>{label}</span>
        </div>
    )
}
