export interface FenceResult {
    /** Количество листов / штакетин / секций */
    count: number
    /** Площадь к оплате, м² */
    area?: number
    /** Метраж столбов, м */
    posts?: number
    /** Количество саморезов */
    screws?: number
    /** Метраж прожилин, м */
    rails?: number
    /** Итого п.м. ламелей */
    lamellaMeters?: number
    /** Боковые планки, м.п. */
    sidePlanks?: number
    /** Верхние планки, п.м. */
    topPlanks?: number
}

/**
 * Расчёт забора из профлиста.
 *
 * P — периметр/длина забора (м)
 * h — высота забора (м)
 * a — расстояние между столбами (м)
 * X  — габаритная ширина листа (мм)
 * X1 — монтажная ширина листа (мм)
 */
export function calcCorrugatedFence(P: number, h: number, a: number, X: number, X1: number): FenceResult {
    const Xm = X / 1000
    const X1m = X1 / 1000
    const N = Math.ceil(P / X1m)
    const area = Xm * h * N
    const posts = (P / a + 1) * (h + 0.5)
    const screws = N * 10
    const rails = 2 * P
    return {
        count: N,
        area: parseFloat(area.toFixed(2)),
        posts: parseFloat(posts.toFixed(2)),
        screws,
        rails: parseFloat(rails.toFixed(2))
    }
}

/**
 * Расчёт забора из штакетника.
 *
 * picketWidth — ширина штакетника (мм)
 * gap — просвет между штакетниками (мм)
 * h — высота забора (м)
 * P — периметр/длина забора (м)
 */
export function calcPicketFence(picketWidth: number, gap: number, _h: number, P: number): FenceResult {
    const pitch = (picketWidth + gap) / 1000
    const N = Math.floor(P / pitch)
    const screws = N * 4
    return {
        count: N,
        screws
    }
}

/**
 * Расчёт забора-жалюзи.
 *
 * K  — количество секций
 * Kh — высота секции (м)
 * L  — ширина секции (м)
 */
export function calcLouvreFence(K: number, Kh: number, L: number): FenceResult {
    const lamellaPerSection = Math.floor(Kh * 13)
    const lamellaMeters = K * lamellaPerSection * L
    const sidePlanks = Kh * K * 2
    const topPlanks = L * K
    return {
        count: K * lamellaPerSection,
        lamellaMeters: parseFloat(lamellaMeters.toFixed(2)),
        sidePlanks: parseFloat(sidePlanks.toFixed(2)),
        topPlanks: parseFloat(topPlanks.toFixed(2))
    }
}
