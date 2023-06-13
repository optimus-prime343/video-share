const ONE_THOUSAND = 1000
const ONE_MILLION = 10_00_000
const ONE_BILLION = 10_000_00_000

/**
 * Format count to K, M, B format
 * e.g 1000 => 1K
 */
export const formatCount = (count: number): string => {
  if (count < ONE_THOUSAND) return count.toString()
  if (count > ONE_THOUSAND && count < ONE_MILLION)
    return `${(count / ONE_THOUSAND).toFixed(1)}K`
  if (count > ONE_MILLION && count < ONE_BILLION) return `${(count / ONE_MILLION).toFixed(1)}M`
  return `${(count / ONE_BILLION).toFixed(1)}B`
}
