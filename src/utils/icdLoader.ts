import { ICD10_DATABASE } from '../data/icd10Data'
import type { ICD10Item } from '../types'

let fullCache: ICD10Item[] | null = null
let loadingPromise: Promise<ICD10Item[]> | null = null

export async function getFullICD10(): Promise<ICD10Item[]> {
  if (fullCache) return fullCache
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      const res = await fetch('/data/icd10_full.json')
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

      fullCache = merged
      return merged
    } catch (err) {
      console.warn('Could not load /data/icd10_full.json, falling back to core dataset:', err)
      fullCache = ICD10_DATABASE
      return ICD10_DATABASE
    }
  })()

  return loadingPromise
}
