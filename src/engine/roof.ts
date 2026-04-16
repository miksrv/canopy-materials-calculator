import { type Material, type RoofResult, type RoofTypeId } from './types'

/**
 * Calculates the number of sheets and payable area for a single-slope roof.
 *
 * L — ширина ската (м)
 * a — длина листа со свесом (м)
 */
function calcSingleSlope(L: number, a: number, material: Material): RoofResult {
    const X = material.X / 1000
    const X1 = material.X1 / 1000
    const N = Math.ceil(L / X1)
    const area = X * a * N
    return { sheets: N, area: parseFloat(area.toFixed(2)) }
}

/**
 * Calculates materials for a double-slope roof.
 *
 * L — ширина ската (м)
 * a — длина левого ската (м)
 * b — длина правого ската (м)
 */
function calcDoubleSlope(L: number, a: number, b: number, material: Material): RoofResult {
    const X = material.X / 1000
    const X1 = material.X1 / 1000
    const N = Math.ceil(L / X1)
    const area = X * a * N + X * b * N
    return { sheets: N * 2, area: parseFloat(area.toFixed(2)) }
}

/**
 * Calculates materials for a mansard roof (4 slopes: a, b upper + c, d lower).
 *
 * L — длина конька (м)
 * a, b — верхние скаты
 * c, d — нижние скаты
 */
function calcMansard(L: number, a: number, b: number, c: number, d: number, material: Material): RoofResult {
    const X = material.X / 1000
    const X1 = material.X1 / 1000
    const N = Math.ceil(L / X1)
    const area = (X * a + X * b + X * c + X * d) * N
    return { sheets: N * 4, area: parseFloat(area.toFixed(2)) }
}

/**
 * Calculates materials for a hip roof.
 *
 * M — ширина дома (м)
 * K — длина конька (м)
 * L — длина дома (м)
 * a — длина ската длинной стороны (м)
 * a2 — длина ската торцевой стороны (м)
 */
function calcHipRoof(M: number, K: number, L: number, a: number, a2: number, material: Material): RoofResult {
    const X = material.X / 1000
    const area = (2 * ((M * a2) / 2) + ((K + L) / 2) * a * 2) * 1.15
    const ridge = K + 4 * Math.sqrt(a2 * a2 + (M / 2) * (M / 2))
    const frontPlanks = (a + a2) * 4
    const sheets = Math.ceil(area / (X * a))
    return {
        sheets,
        area: parseFloat(area.toFixed(2)),
        ridge: parseFloat(ridge.toFixed(2)),
        frontPlanks: parseFloat(frontPlanks.toFixed(2))
    }
}

/**
 * Calculates materials for a pyramid (tent/hip) roof.
 *
 * M — ширина дома (м)
 * L — длина дома (м)
 * a — длина длинного ската (м)
 * a2 — длина короткого ската (м)
 */
function calcPyramidRoof(M: number, L: number, a: number, a2: number, material: Material): RoofResult {
    const X = material.X / 1000
    const area = (2 * ((a2 * M) / 2) + 2 * ((a * L) / 2)) * 1.15
    const ridge = Math.sqrt(a2 * a2 + (M / 2) * (M / 2)) * 4
    const sheets = Math.ceil(area / (X * a))
    return {
        sheets,
        area: parseFloat(area.toFixed(2)),
        ridge: parseFloat(ridge.toFixed(2))
    }
}

/**
 * Universal entry point: dispatches to the correct formula based on roof type.
 *
 * @param typeId - one of RoofTypeId
 * @param params - object with numeric parameter values (L, a, b, etc.) in metres
 * @param material - selected material with X / X1 dimensions in mm
 */
export function calcRoof(typeId: RoofTypeId, params: Record<string, number>, material: Material): RoofResult {
    switch (typeId) {
        case 'single':
            return calcSingleSlope(params.L, params.a, material)
        case 'double':
            return calcDoubleSlope(params.L, params.a, params.b, material)
        case 'mansard':
            return calcMansard(params.L, params.a, params.b, params.c, params.d, material)
        case 'hip':
            return calcHipRoof(params.M, params.K, params.L, params.a, params.a2, material)
        case 'pyramid':
            return calcPyramidRoof(params.M, params.L, params.a, params.a2, material)
    }
}
