import type { ICD10Item, DepartmentKey } from '../types'

export function removeVietnameseTones(str: string): string {
  if (!str) return ''
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  return str.trim()
}

export function searchMatches(text: string, query: string): boolean {
  if (!query) return true
  if (!text) return false
  return removeVietnameseTones(text).toLowerCase().includes(removeVietnameseTones(query).toLowerCase().trim())
}

export interface HighlightSegment {
  text: string
  isMatch: boolean
}

/**
 * Splits text into matched and non-matched segments for visual keyword highlighting,
 * matching both accented and unaccented terms, as well as code formats like J20 vs J20.0.
 */
export function splitForHighlight(text: string, query: string): HighlightSegment[] {
  if (!text) return []
  if (!query || !query.trim()) return [{ text, isMatch: false }]

  const cleanQ = removeVietnameseTones(query).trim().toLowerCase()
  const rawQ = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const tokens = cleanQ.split(/\s+/).filter(Boolean)

  if (!tokens.length && !rawQ) return [{ text, isMatch: false }]

  // Split text by word boundaries and punctuation
  const segments = text.split(/(\s+|[.,;:()/\-–—\[\]{}])/g)
  return segments.map((seg) => {
    if (!seg) return { text: '', isMatch: false }
    const cleanSeg = removeVietnameseTones(seg).toLowerCase()
    const rawSeg = seg.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

    let isMatch = false
    if (rawQ && rawSeg && (rawSeg === rawQ || (rawQ.length >= 2 && rawSeg.startsWith(rawQ)))) {
      isMatch = true
    } else if (tokens.length > 0) {
      isMatch = tokens.some((t) => {
        if (!t) return false
        if (cleanSeg === t) return true
        if (t.length >= 3 && cleanSeg.includes(t)) return true
        if (cleanSeg.length >= 3 && t.includes(cleanSeg)) return true
        return false
      })
    }

    return { text: seg, isMatch }
  })
}

export const POPULAR_DISEASES = [
  { label: 'Tăng huyết áp (I10)', query: 'I10' },
  { label: 'Cận thị (H52.1)', query: 'H52.1' },
  { label: 'Viêm phế quản (J20)', query: 'J20' },
  { label: 'Đái tháo đường (E11)', query: 'E11' },
  { label: 'Viêm dạ dày (K29)', query: 'K29' },
  { label: 'Viêm xoang (J32)', query: 'viêm xoang' },
  { label: 'Sâu răng (K02)', query: 'K02' },
  { label: 'Viêm gan B (B18.1)', query: 'B18.1' },
  { label: 'Gãy xương (S00-T14)', query: 'gãy xương' },
  { label: 'Viêm tai giữa (H65/H66)', query: 'viêm tai' },
]

export function searchICD10(
  items: ICD10Item[],
  query: string,
  department: DepartmentKey | 'ALL' = 'ALL',
  militaryFilter: 'ALL' | 'eligible' | 'conditional' | 'ineligible' = 'ALL',
  levelFilter: 'ALL' | 'category3' | 'subcategory4' = 'ALL',
  chapterFilter: 'ALL' | string = 'ALL'
): ICD10Item[] {
  const cleanQ = removeVietnameseTones(query).trim().toLowerCase()
  const rawQ = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  const tokens = cleanQ ? cleanQ.split(/\s+/).filter(Boolean) : []
  const hasTokens = tokens.length > 0
  const upperQ = query.trim().toUpperCase()

  const results: { item: ICD10Item; score: number }[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.code === 'MÃ') continue

    // 1. Department filter
    if (department !== 'ALL' && item.department !== department) {
      continue
    }

    // 2. Military status filter
    if (militaryFilter !== 'ALL' && item.militaryAdmissionStatus !== militaryFilter) {
      continue
    }

    // 3. Level filter (Mã 3 ký tự vs Mã chi tiết 4 ký tự)
    if (levelFilter === 'category3') {
      if (item.code.includes('.') || item.code.length > 3) continue
    } else if (levelFilter === 'subcategory4') {
      if (!item.code.includes('.') && item.code.length <= 3) continue
    }

    // 4. Chapter filter
    if (chapterFilter !== 'ALL') {
      if (!item.chapter.includes(chapterFilter) && !chapterFilter.includes(item.chapter.split('.')[0])) {
        continue
      }
    }

    // 5. If no search query, return naturally without scoring
    if (!hasTokens && !rawQ) {
      results.push({ item: { ...item, _matchPercent: undefined, _score: 0 }, score: 0 })
      continue
    }

    const cleanCode = item._cleanCode || (item._cleanCode = item.code.toLowerCase())
    const rawCode = item._rawCode || (item._rawCode = item.code.replace(/[^a-zA-Z0-9]/g, '').toLowerCase())
    const cleanNameVi = removeVietnameseTones(item.nameVi || '')
    const cleanSearch =
      item._cleanSearch ||
      (item._cleanSearch = `${cleanCode} ${rawCode} ${removeVietnameseTones(`${item.nameVi} ${item.nameEn || ''}`)}`)

    // All tokens must be present in search text
    let matchesAll = true
    for (let t = 0; t < tokens.length; t++) {
      if (!cleanSearch.includes(tokens[t])) {
        matchesAll = false
        break
      }
    }

    // Also check if raw alphanumeric code matches (e.g. j200 matches J20.0)
    const rawMatches = rawQ && (rawCode === rawQ || (rawQ.length >= 3 && rawCode.startsWith(rawQ)))
    if (!matchesAll && !rawMatches) continue

    // --- HIGH-PRECISION RELEVANCE & MATCH PERCENTAGE SCORING ---
    const strippedName = cleanNameVi.replace(/^(benh ly|benh|hoi chung|roi loan|tinh trang)\s+/, '')
    const nameWords = cleanNameVi.split(/\s+/).filter(Boolean)

    let score = 0
    let matchPercent = 60
    const isExactName = cleanNameVi === cleanQ || strippedName === cleanQ

    if (item.code.toUpperCase() === upperQ) {
      score += 100000 // 100% exact formatted code (I10, J20)
      matchPercent = 100
    } else if (rawQ && rawCode === rawQ) {
      score += 90000 // 100% exact unpunctuated code (J200 -> J20.0)
      matchPercent = 100
    } else if (item.code.toUpperCase().startsWith(upperQ)) {
      score += 50000
      matchPercent = 95
    } else if (rawQ && rawCode.startsWith(rawQ)) {
      score += 40000
      matchPercent = 92
    }

    if (isExactName) {
      score += 35000
      matchPercent = 100
    }

    // Consecutive phrase matching
    let phraseIdx = -1
    if (strippedName.startsWith(cleanQ)) {
      score += 25000
      phraseIdx = 0
    } else if (cleanNameVi.startsWith(cleanQ)) {
      score += 23000
      phraseIdx = 0
    } else {
      phraseIdx = cleanNameVi.indexOf(cleanQ)
      if (phraseIdx !== -1) {
        score += 15000
        const charBefore = cleanNameVi[phraseIdx - 1]
        if (charBefore === ' ' || charBefore === '(' || charBefore === '[' || charBefore === '-') {
          score += 4000
        }
      }
    }

    // Whole word matching
    let wholeWordMatches = 0
    for (let t = 0; t < tokens.length; t++) {
      if (nameWords.includes(tokens[t])) {
        wholeWordMatches++
      }
    }
    score += wholeWordMatches * 3000

    if (tokens.length > 0 && wholeWordMatches === tokens.length) {
      score += 10000
    }

    // Coverage / Match ratio percentage
    const coreLength = strippedName.length || cleanNameVi.length
    const coverage = coreLength > 0 && cleanQ.length > 0 ? Math.min(1, cleanQ.length / coreLength) : 0
    score += Math.round(coverage * 8000)

    // Promotion for 3-character primary category codes
    if (!item.code.includes('.') && item.code.length === 3) {
      score += 5000
    }

    // Priority core clinical diseases
    if (['I10', 'E10', 'E11', 'J20', 'H52.1', 'K29', 'J45', 'B18.1'].includes(item.code)) {
      score += 8000
    }

    // Compute display match percentage (between 60% and 100%)
    if (matchPercent < 100) {
      if (phraseIdx === 0) {
        matchPercent = Math.min(99, 90 + Math.round(coverage * 9))
      } else if (phraseIdx > 0) {
        matchPercent = Math.min(89, 80 + Math.round(coverage * 9))
      } else if (wholeWordMatches === tokens.length && tokens.length > 0) {
        matchPercent = Math.min(85, 75 + Math.round(coverage * 10))
      } else {
        matchPercent = Math.min(79, 60 + Math.round(coverage * 19))
      }
    }

    results.push({
      item: {
        ...item,
        _score: score,
        _matchPercent: matchPercent
      },
      score
    })
  }

  // Sort strictly by relevance score descending
  if (hasTokens || rawQ) {
    results.sort((a, b) => b.score - a.score)
  }

  return results.map((r) => r.item)
}
