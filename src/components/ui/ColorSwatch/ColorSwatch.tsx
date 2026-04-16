import styles from './ColorSwatch.module.css'

interface ColorSwatchProps {
    label: string
    hex: string
    selected: boolean
    onClick: () => void
}

/**
 * Circular color swatch for the color picker.
 * Shows the color as a filled circle; selected state adds a ring.
 */
export default function ColorSwatch({ label, hex, selected, onClick }: ColorSwatchProps): React.JSX.Element {
    return (
        <div
            className={`${styles.swatch} ${selected ? styles.selected : ''}`}
            style={{ '--swatch-color': hex } as React.CSSProperties}
            onClick={onClick}
            role='radio'
            aria-checked={selected}
            aria-label={label}
            title={label}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onClick()
                }
            }}
        >
            <div className={styles.circle} />
            {selected && (
                <svg
                    className={styles.check}
                    viewBox='0 0 10 10'
                    fill='none'
                >
                    <path
                        d='M2 5 L4.2 7.5 L8 3'
                        stroke='#fff'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>
            )}
        </div>
    )
}
