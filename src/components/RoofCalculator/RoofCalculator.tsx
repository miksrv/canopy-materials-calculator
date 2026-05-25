import { useCallback, useState } from 'react'

import { calcRoof } from '../../engine/roof'
import { type Material, type MaterialId, type RoofResult, type RoofTypeId } from '../../engine/types'
import RoofDoubleSlope from '../diagrams/RoofDoubleSlope'
import RoofHip from '../diagrams/RoofHip'
import RoofMansard from '../diagrams/RoofMansard'
import RoofPyramid from '../diagrams/RoofPyramid'
import RoofSingleSlope from '../diagrams/RoofSingleSlope'
import ColorSwatch from '../ui/ColorSwatch/ColorSwatch'
import NumberInput from '../ui/NumberInput/NumberInput'
import OptionChip from '../ui/OptionChip/OptionChip'
import RadioCard from '../ui/RadioCard/RadioCard'
import ResultTable, { type ResultRow } from '../ui/ResultTable/ResultTable'
import SelectDropdown from '../ui/SelectDropdown/SelectDropdown'

import styles from './RoofCalculator.module.css'
import colorsData from '../../data/colors.json'
import materialsData from '../../data/materials.json'
import profilesData from '../../data/profiles.json'
import roofTypesData from '../../data/roof-types.json'
import surfaceTypesData from '../../data/surface-types.json'
import thicknessData from '../../data/thickness.json'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoofType {
    id: RoofTypeId
    label: string
    params: string[]
}

interface SurfaceType {
    id: string
    label: string
}

interface ColorOption {
    id: string
    label: string
    hex: string
}

interface ProfileOption {
    id: string
    label: string
    materialId: string
    X: number
    X1: number
}

interface ThicknessOption {
    id: string
    label: string
}

// ─── Param metadata + validation limits ──────────────────────────────────────

interface ParamMeta {
    label: string
    unit: string
    min: number
    max: number
}

const PARAM_META: Record<string, ParamMeta> = {
    L: { label: 'Ширина ската', unit: 'м', min: 0.5, max: 150 },
    a: { label: 'Длина ската (левый / передний)', unit: 'м', min: 0.5, max: 50 },
    b: { label: 'Длина ската (правый / задний)', unit: 'м', min: 0.5, max: 50 },
    c: { label: 'Нижний скат — левый', unit: 'м', min: 0.5, max: 50 },
    d: { label: 'Нижний скат — правый', unit: 'м', min: 0.5, max: 50 },
    M: { label: 'Ширина дома', unit: 'м', min: 1, max: 50 },
    K: { label: 'Длина конька', unit: 'м', min: 0.5, max: 150 },
    a2: { label: 'Длина торцевого ската', unit: 'м', min: 0.5, max: 50 }
}

function validateParam(name: string, value: number): string | null {
    if (value <= 0) {
        return 'Введите значение'
    }
    const meta = PARAM_META[name]
    if (!meta) {
        return null
    }
    if (value < meta.min) {
        return `Минимум ${meta.min} м`
    }
    if (value > meta.max) {
        return `Максимум ${meta.max} м`
    }
    return null
}

function validateAll(params: string[], values: Record<string, number>): Record<string, string | null> {
    return Object.fromEntries(params.map((p) => [p, validateParam(p, values[p] ?? 0)]))
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const roofTypes = roofTypesData as RoofType[]
const materials = materialsData as Material[]
const surfaceTypes = surfaceTypesData as SurfaceType[]
const colors = colorsData as ColorOption[]
const profiles = profilesData as ProfileOption[]
const thicknessOptions = thicknessData as ThicknessOption[]

function buildDefaultParams(params: string[]): Record<string, number> {
    return Object.fromEntries(params.map((p) => [p, 0]))
}

function buildEmptyErrors(params: string[]): Record<string, string | null> {
    return Object.fromEntries(params.map((p) => [p, null]))
}

function buildResultRows(
    result: RoofResult,
    selections: {
        surfaceType: string | null
        color: string | null
        profile: string | null
        thickness: string | null
    }
): ResultRow[] {
    const rows: ResultRow[] = [
        { param: 'Количество листов', value: `${result.sheets} шт.`, highlight: true },
        { param: 'Площадь к оплате', value: `${result.area.toFixed(2)} м²`, highlight: true }
    ]
    if (result.ridge !== undefined) {
        rows.push({ param: 'Конёк', value: `${result.ridge.toFixed(2)} п.м.` })
    }
    if (result.frontPlanks !== undefined) {
        rows.push({ param: 'Фронтонные планки', value: `${result.frontPlanks.toFixed(2)} п.м.` })
    }

    if (selections.surfaceType) {
        const st = surfaceTypes.find((s) => s.id === selections.surfaceType)
        if (st) {
            rows.push({ param: 'Покрытие', value: st.label })
        }
    }
    if (selections.color) {
        const c = colors.find((c) => c.id === selections.color)
        if (c) {
            rows.push({ param: 'Цвет', value: c.label })
        }
    }
    if (selections.profile) {
        const p = profiles.find((p) => p.id === selections.profile)
        if (p) {
            rows.push({ param: 'Профиль', value: p.label })
        }
    }
    if (selections.thickness) {
        const th = thicknessOptions.find((t) => t.id === selections.thickness)
        if (th) {
            rows.push({ param: 'Толщина металла', value: th.label })
        }
    }

    return rows
}

// ─── Diagram map ──────────────────────────────────────────────────────────────

function RoofDiagram({ typeId, activeParam }: { typeId: RoofTypeId; activeParam: string | null }): React.JSX.Element {
    switch (typeId) {
        case 'single':
            return <RoofSingleSlope activeParam={activeParam} />
        case 'double':
            return <RoofDoubleSlope activeParam={activeParam} />
        case 'mansard':
            return <RoofMansard activeParam={activeParam} />
        case 'hip':
            return <RoofHip activeParam={activeParam} />
        case 'pyramid':
            return <RoofPyramid activeParam={activeParam} />
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * RoofCalculator — calculates roof materials on button click.
 * Validates all dimension inputs and requires all configuration
 * selections before enabling the calculate button.
 */
export default function RoofCalculator(): React.JSX.Element {
    const [selectedRoofType, setSelectedRoofType] = useState<RoofTypeId>('single')
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialId>('metalltile')
    const [params, setParams] = useState<Record<string, number>>(buildDefaultParams(roofTypes[0].params))
    const [errors, setErrors] = useState<Record<string, string | null>>(buildEmptyErrors(roofTypes[0].params))
    const [result, setResult] = useState<RoofResult | null>(null)
    const [resultStale, setResultStale] = useState(false)
    const [activeParam, setActiveParam] = useState<string | null>(null)

    // Configuration selections
    const [selectedSurface, setSelectedSurface] = useState<string | null>(null)
    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null)
    const [selectedThickness, setSelectedThickness] = useState<string | null>(null)

    const currentRoofType = roofTypes.find((rt) => rt.id === selectedRoofType)!
    const currentMaterial = materials.find((m) => m.id === selectedMaterial)!

    const filteredProfiles = profiles.filter((p) => p.materialId === selectedMaterial)

    const hasFormErrors = currentRoofType.params.some((p) => errors[p] != null)

    const profileRequired = selectedMaterial !== 'falc'

    const allSelectionsComplete =
        selectedSurface != null &&
        selectedColor != null &&
        (!profileRequired || selectedProfile != null) &&
        selectedThickness != null

    const missingSelections = [
        !selectedSurface && 'покрытие',
        !selectedColor && 'цвет',
        profileRequired && !selectedProfile && 'профиль',
        !selectedThickness && 'толщину металла'
    ].filter(Boolean) as string[]

    const calcDisabled = hasFormErrors || !allSelectionsComplete

    // Reset everything when roof type changes
    const handleRoofTypeChange = useCallback((id: RoofTypeId) => {
        const type = roofTypes.find((rt) => rt.id === id)!
        setSelectedRoofType(id)
        setParams(buildDefaultParams(type.params))
        setErrors(buildEmptyErrors(type.params))
        setResult(null)
        setResultStale(false)
    }, [])

    const handleMaterialChange = useCallback(
        (id: MaterialId) => {
            setSelectedMaterial(id)
            setSelectedProfile(null)
            if (result) {
                setResultStale(true)
            }
        },
        [result]
    )

    const handleParamChange = useCallback(
        (name: string, value: number) => {
            setParams((prev) => ({ ...prev, [name]: value }))
            setErrors((prev) => ({ ...prev, [name]: validateParam(name, value) }))
            if (result) {
                setResultStale(true)
            }
        },
        [result]
    )

    const handleSelectionChange = useCallback(
        (setter: (v: string) => void, id: string) => {
            setter(id)
            if (result) {
                setResultStale(true)
            }
        },
        [result]
    )

    const handleCalcClick = () => {
        const newErrors = validateAll(currentRoofType.params, params)
        setErrors(newErrors)
        if (Object.values(newErrors).some((e) => e != null)) {
            return
        }

        const selectedProfileObj = profiles.find((p) => p.id === selectedProfile)
        const materialForCalc: Material =
            selectedProfileObj != null
                ? { ...currentMaterial, X: selectedProfileObj.X, X1: selectedProfileObj.X1 }
                : currentMaterial
        const res = calcRoof(selectedRoofType, params, materialForCalc)
        setResult(res)
        setResultStale(false)
    }

    const resultRows = result
        ? buildResultRows(result, {
              surfaceType: selectedSurface,
              color: selectedColor,
              profile: selectedProfile,
              thickness: selectedThickness
          })
        : []

    // Selected color object for name display
    const selectedColorObj = colors.find((c) => c.id === selectedColor)

    return (
        <div className={styles.calculator}>
            {/* ── Roof type selector ── */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Выбор типа кровли</div>
                <div
                    className={styles.roofTypeGrid}
                    role='radiogroup'
                    aria-label='Тип кровли'
                >
                    {roofTypes.map((rt) => (
                        <RadioCard
                            key={rt.id}
                            label={rt.label}
                            image={`/images/roofs/${rt.id}.png`}
                            selected={selectedRoofType === rt.id}
                            onClick={() => handleRoofTypeChange(rt.id)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Two-column: form left, diagram right ── */}
            <div className={styles.formDiagramRow}>
                <div className={styles.formColumn}>
                    {/* Material selector */}
                    <div className={styles.formColumnSection}>
                        <div className={styles.sectionTitle}>Материал кровли</div>
                        <div
                            className={styles.materialGrid}
                            role='radiogroup'
                            aria-label='Материал'
                        >
                            {materials.map((mat) => (
                                <RadioCard
                                    key={mat.id}
                                    label={mat.name}
                                    image={`/images/materials/${mat.id}.png`}
                                    selected={selectedMaterial === mat.id}
                                    onClick={() => handleMaterialChange(mat.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Dimensions */}
                    <div className={styles.formColumnSection}>
                        <div className={styles.sectionTitle}>Размеры кровли</div>
                        <div className={styles.paramsGrid}>
                            {currentRoofType.params.map((paramName) => {
                                const meta = PARAM_META[paramName] ?? {
                                    label: paramName,
                                    unit: 'м',
                                    min: 0.1,
                                    max: 200
                                }
                                return (
                                    <NumberInput
                                        key={paramName}
                                        label={meta.label}
                                        paramName={paramName}
                                        unit={meta.unit}
                                        value={params[paramName] ?? 0}
                                        onChange={(v) => handleParamChange(paramName, v)}
                                        onFocus={() => setActiveParam(paramName)}
                                        onBlur={() => setActiveParam(null)}
                                        min={meta.min}
                                        step={0.1}
                                        error={errors[paramName]}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Diagram column — key forces remount on type change, triggering CSS animation */}
                <div
                    className={styles.diagramColumn}
                    aria-hidden='true'
                >
                    <div
                        key={selectedRoofType}
                        className={styles.diagramAnimate}
                    >
                        <RoofDiagram
                            typeId={selectedRoofType}
                            activeParam={activeParam}
                        />
                    </div>
                </div>
            </div>

            {/* ── Surface type ── */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Выбор покрытия</div>
                <div
                    className={styles.chipGrid}
                    role='radiogroup'
                    aria-label='Покрытие'
                >
                    {surfaceTypes.map((st) => (
                        <OptionChip
                            key={st.id}
                            label={st.label}
                            selected={selectedSurface === st.id}
                            onClick={() => handleSelectionChange(setSelectedSurface, st.id)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Color ── */}
            <div className={styles.section}>
                <div className={styles.sectionTitleRow}>
                    <div className={styles.sectionTitle}>Выбор цвета</div>
                    {selectedColorObj && (
                        <div className={styles.selectedColorLabel}>
                            <span
                                className={styles.selectedColorDot}
                                style={{ background: selectedColorObj.hex }}
                            />
                            {selectedColorObj.label}
                        </div>
                    )}
                </div>
                <div
                    className={styles.colorGrid}
                    role='radiogroup'
                    aria-label='Цвет'
                >
                    {colors.map((c) => (
                        <ColorSwatch
                            key={c.id}
                            label={c.label}
                            hex={c.hex}
                            selected={selectedColor === c.id}
                            onClick={() => handleSelectionChange(setSelectedColor, c.id)}
                        />
                    ))}
                </div>
            </div>

            {/* ── Profile ── */}
            {selectedMaterial !== 'falc' && (
                <div className={styles.section}>
                    <div className={styles.sectionTitle}>Выбор профиля</div>
                    <div
                        className={styles.tileGrid}
                        role='radiogroup'
                        aria-label='Профиль'
                    >
                        {filteredProfiles.map((p) => (
                            <OptionChip
                                key={p.id}
                                label={p.label}
                                selected={selectedProfile === p.id}
                                onClick={() => handleSelectionChange(setSelectedProfile, p.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Thickness ── */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Толщина металла</div>
                <SelectDropdown
                    options={thicknessOptions}
                    value={selectedThickness}
                    placeholder='Выбрать толщину'
                    onChange={(id) => handleSelectionChange(setSelectedThickness, id)}
                />
            </div>

            {/* ── Action row ── */}
            <div className={styles.actionRow}>
                <button
                    className={styles.calcButton}
                    onClick={handleCalcClick}
                    disabled={calcDisabled}
                    aria-label='Сделать расчёт'
                >
                    Сделать расчёт
                </button>
                {hasFormErrors && <span className={styles.calcHintError}>Исправьте ошибки в форме</span>}
                {!hasFormErrors && missingSelections.length > 0 && (
                    <span className={styles.calcHint}>Выберите: {missingSelections.join(', ')}</span>
                )}
            </div>

            {/* ── Results ── */}
            <div className={styles.resultsSection}>
                <ResultTable
                    rows={resultRows}
                    stale={resultStale}
                />
            </div>
        </div>
    )
}
