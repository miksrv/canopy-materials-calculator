import styles from './SelectTabs.module.css'

export interface TabItem {
    id: string
    label: string
}

interface SelectTabsProps {
    tabs: TabItem[]
    activeId: string
    onChange: (id: string) => void
}

/**
 * Horizontal tab switcher (e.g. "Кровля" / "Заборы").
 */
export default function SelectTabs({ tabs, activeId, onChange }: SelectTabsProps): React.JSX.Element {
    return (
        <nav
            className={styles.tabs}
            role='tablist'
            aria-label='Раздел калькулятора'
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    role='tab'
                    aria-selected={tab.id === activeId}
                    className={`${styles.tab} ${tab.id === activeId ? styles.active : ''}`}
                    onClick={() => onChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    )
}
