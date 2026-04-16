import { useEffect, useRef, useState } from 'react'

import styles from './SelectDropdown.module.css'

interface SelectOption {
    id: string
    label: string
}

interface SelectDropdownProps {
    options: SelectOption[]
    value: string | null
    placeholder?: string
    onChange: (id: string) => void
}

/**
 * Custom dropdown for selecting a single option from a list.
 * Used for metal thickness selection.
 */
export default function SelectDropdown({
    options,
    value,
    placeholder = 'Выбрать...',
    onChange
}: SelectDropdownProps): React.JSX.Element {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const selected = options.find((o) => o.id === value)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div
            className={styles.wrapper}
            ref={ref}
        >
            <div
                className={`${styles.trigger} ${open ? styles.triggerOpen : ''} ${selected ? styles.triggerSelected : ''}`}
                onClick={() => setOpen((o) => !o)}
                role='combobox'
                aria-expanded={open}
                aria-haspopup='listbox'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpen((o) => !o)
                    }
                    if (e.key === 'Escape') {
                        setOpen(false)
                    }
                }}
            >
                <span className={selected ? styles.triggerValue : styles.triggerPlaceholder}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg
                    className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}
                    width='16'
                    height='9'
                    viewBox='0 0 20 11'
                    fill='none'
                >
                    <path
                        d='M19.164 1L10.082 9.806L1 1'
                        stroke='currentColor'
                        strokeMiterlimit='10'
                    />
                </svg>
            </div>

            {open && (
                <div
                    className={styles.dropdown}
                    role='listbox'
                >
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`${styles.option} ${opt.id === value ? styles.optionSelected : ''}`}
                            role='option'
                            aria-selected={opt.id === value}
                            onClick={() => {
                                onChange(opt.id)
                                setOpen(false)
                            }}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
