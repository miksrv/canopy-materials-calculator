import styles from './OptionChip.module.css'

interface OptionChipProps {
    label: string
    subtitle?: string | null
    selected: boolean
    onClick: () => void
}

/**
 * Compact text-only selectable chip.
 * Used for surface types, profiles, coatings.
 */
export default function OptionChip({ label, subtitle, selected, onClick }: OptionChipProps): React.JSX.Element {
    return (
        <div
            className={`${styles.chip} ${selected ? styles.selected : ''}`}
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
            <span className={styles.label}>{label}</span>
            {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
    )
}
