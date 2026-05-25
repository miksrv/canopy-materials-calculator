export type RoofTypeId = 'single' | 'double' | 'mansard' | 'hip' | 'pyramid'
export type FenceTypeId = 'corrugated' | 'picket' | 'louvre'
export type MaterialId = 'proflist' | 'metalltile' | 'falc'

export interface Material {
    id: MaterialId
    name: string
    /** Габаритная ширина листа, мм */
    X: number
    /** Монтажная ширина листа, мм */
    X1: number
}

export interface Profile {
    id: string
    label: string
    materialId: MaterialId
    /** Габаритная ширина, мм */
    X: number
    /** Монтажная ширина, мм */
    X1: number
}

export interface RoofSingleSlopeParams {
    L: number
    a: number
}

export interface RoofDoubleSlopeParams {
    L: number
    a: number
    b: number
}

export interface RoofMansardParams {
    L: number
    a: number
    b: number
    c: number
    d: number
}

export interface RoofHipParams {
    M: number
    K: number
    L: number
    a: number
    a2: number
}

export interface RoofPyramidParams {
    M: number
    L: number
    a: number
    a2: number
}

export interface RoofResult {
    /** Количество листов */
    sheets: number
    /** Площадь к оплате, м² */
    area: number
    /** Конёк, п.м. (если применимо) */
    ridge?: number
    /** Фронтонные планки, п.м. (если применимо) */
    frontPlanks?: number
}

export interface RoofTypeConfig {
    id: RoofTypeId
    label: string
    params: string[]
}

export interface FenceTypeConfig {
    id: FenceTypeId
    label: string
    params: string[]
}
