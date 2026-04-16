import styles from './ResultTable.module.css'

export interface ResultRow {
    param: string
    value: string
    highlight?: boolean
}

interface ResultTableProps {
    rows: ResultRow[]
    title?: string
    /** When true — show a notice that params changed and result may be outdated */
    stale?: boolean
}

/**
 * Two-column table: parameter name | value.
 * Rows with `highlight: true` receive emphasized styling.
 * When `stale` is true, a banner is shown prompting the user to recalculate.
 */
export default function ResultTable({
    rows,
    title = 'Результаты расчёта',
    stale = false
}: ResultTableProps): React.JSX.Element {
    if (rows.length === 0) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.heading}>{title}</div>
                <div className={styles.empty}>
                    <span
                        className={styles.emptyIcon}
                        aria-hidden='true'
                    >
                        📐
                    </span>
                    <span className={styles.emptyText}>
                        Заполните форму и нажмите
                        <br />
                        «Сделать расчёт»
                    </span>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.heading}>{title}</div>
            {stale && (
                <div
                    className={styles.staleNotice}
                    role='status'
                >
                    <span aria-hidden='true'>⚠️</span>
                    Параметры изменились — нажмите «Сделать расчёт» для обновления
                </div>
            )}
            <table className={`${styles.table} ${stale ? styles.tableStale : ''}`}>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={i}
                            className={row.highlight ? styles.highlight : ''}
                        >
                            <td className={styles.paramCell}>{row.param}</td>
                            <td className={styles.valueCell}>{row.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
