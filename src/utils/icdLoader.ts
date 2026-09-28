import { ICD10_DATABASE } from '../data/icd10Data'
import type { ICD10Item } from '../types'
import { removeVietnameseTones } from './searchHelper'

let fullCache: ICD10Item[] | null = null
let loadingPromise: Promise<ICD10Item[]> | null = null

export async function getFullICD10(): Promise<ICD10Item[]> {
  if (fullCache) return fullCache
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const basePath = import.meta.env.BASE_URL || '/'
      const jsonUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}data/icd10_full.json`
      const res = await fetch(jsonUrl)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const json: ICD10Item[] = await res.json()

      // Map verified clinical items to override generic ones
      const customMap = new Map<string, ICD10Item>()
      ICD10_DATABASE.forEach((item) => customMap.set(item.code, item))

      const merged: ICD10Item[] = json.map((item) => {
        if (customMap.has(item.code)) {
          return customMap.get(item.code)!
        }
        return item
      })

      // Add any custom items that might not be in json
      ICD10_DATABASE.forEach((item) => {
        if (!merged.some((m) => m.code === item.code)) {
          merged.unshift(item)
        }
      })

      // Pre-index all items for instant O(1) searches
      const indexed = merged.map((item) => {
        const cleanCode = item.code.toLowerCase()
        const cleanSearch = `${cleanCode} ${removeVietnameseTones(`${item.nameVi} ${item.nameEn || ''}`)}`
        return {
          ...item,
          _cleanCode: cleanCode,
          _cleanSearch: cleanSearch
        }
      })

      fullCache = indexed
      return indexed
    } catch (err) {
      console.warn('Could not load /data/icd10_full.json, falling back to core dataset:', err)
      fullCache = ICD10_DATABASE
      return ICD10_DATABASE
    }
  })()

  return loadingPromise
}
