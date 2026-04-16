import styles from './NumberInput.module.css'

interface NumberInputProps {
    /** Full descriptive label shown above the input */
    label: string
    /** Short parameter name shown as badge (e.g. "L", "a", "M") */
    paramName: string
    /** Unit suffix displayed on the right (e.g. "м", "мм") */
    unit?: string
    value: number
    onChange: (value: number) => void
    onFocus?: () => void
    onBlur?: () => void
    min?: number
    step?: number
    /** Validation error message — shown in red below the field */
    error?: string | null
}

/**
 * Numeric input with a colored badge showing the parameter symbol,
 * a descriptive label above, and an optional unit suffix.
 */
export default function NumberInput({
    label,
    paramName,
    unit = 'м',
    value,
    onChange,
    onFocus,
    onBlur,
    min = 0,
    step = 0.1,
    error
}: NumberInputProps): React.JSX.Element {
    return (
        <div className={styles.wrapper}>
            <span className={styles.label}>{label}</span>
            <div className={`${styles.inputRow} ${error ? styles.inputRowError : ''}`}>
                <span className={`${styles.badge} ${error ? styles.badgeError : ''}`}>{paramName}</span>
                <input
                    className={styles.input}
                    type='number'
                    min={min}
                    step={step}
                    value={value === 0 ? '' : value}
                    placeholder='0'
                    onChange={(e) => {
                        const raw = parseFloat(e.target.value)
                        onChange(isNaN(raw) ? 0 : raw)
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-label={label}
                    aria-invalid={!!error}
                />
                {unit && <span className={styles.unit}>{unit}</span>}
            </div>
            {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
    )
}
