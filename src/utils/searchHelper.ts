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

export function indexICDItem(item: ICD10Item): ICD10Item {
  if (item._cleanSearch) return item
  const cleanCode = item.code.toLowerCase()
  const cleanName = removeVietnameseTones(`${item.nameVi} ${item.nameEn || ''}`)
  return {
    ...item,
    _cleanCode: cleanCode,
    _cleanSearch: `${cleanCode} ${cleanName}`
  }
}

export function searchICD10(
  items: ICD10Item[],
  query: string,
  department: DepartmentKey | 'ALL' = 'ALL',
  militaryFilter: 'ALL' | 'eligible' | 'conditional' | 'ineligible' = 'ALL'
): ICD10Item[] {
  const cleanQ = removeVietnameseTones(query).trim().toLowerCase()
  const tokens = cleanQ ? cleanQ.split(/\s+/).filter(Boolean) : []
  const hasTokens = tokens.length > 0
  const upperQ = query.trim().toUpperCase()

  // Filter pass
  const results: { item: ICD10Item; score: number }[] = []

  for (let i = 0; i < items.length; i++) {
    const item = items[i]

    // 1. Department filter
    if (department !== 'ALL' && item.department !== department) {
      continue
    }

    // 2. Military status filter
    if (militaryFilter !== 'ALL' && item.militaryAdmissionStatus !== militaryFilter) {
      continue
    }

    // 3. Search match
    if (!hasTokens) {
      results.push({ item, score: 0 })
      continue
    }

    const cleanSearch = item._cleanSearch || (item._cleanSearch = `${item.code.toLowerCase()} ${removeVietnameseTones(item.nameVi)}`)
    const code = item.code

    // All tokens must be present
    let matchesAll = true
    for (let t = 0; t < tokens.length; t++) {
      if (!cleanSearch.includes(tokens[t])) {
        matchesAll = false
        break
      }
    }

    if (!matchesAll) continue

    // Relevance scoring for top ranking
    let score = 10
    if (code === upperQ) {
      score += 1000 // Exact code match
    } else if (code.startsWith(upperQ)) {
      score += 500 // Code starts with query
    } else if (cleanSearch.startsWith(cleanQ)) {
      score += 200 // Name starts with query
    } else if (item.nameVi.toLowerCase().includes(cleanQ)) {
      score += 100
    }

    results.push({ item, score })
  }

  // If searched with query, sort by relevance score descending
  if (hasTokens) {
    results.sort((a, b) => b.score - a.score)
  }

  return results.map((r) => r.item)
}
