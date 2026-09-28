import React, { useState, useEffect, useMemo, useDeferredValue, useRef } from 'react'
import { ICD10_DATABASE } from '../data/icd10Data'
import { getFullICD10 } from '../utils/icdLoader'
import { searchICD10, splitForHighlight, POPULAR_DISEASES } from '../utils/searchHelper'
import { Pagination } from './Pagination'
import type { ICD10Item, DepartmentKey } from '../types'
import {
  Search,
  PlusCircle,
  Check,
  AlertTriangle,
  ShieldCheck,
  HeartPulse,
  BookOpen,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Loader2,
  Copy,
  Layers,
  Sparkles
} from 'lucide-react'

interface ICDSearchProps {
  onSelectForAssessment?: (item: ICD10Item) => void
  selectedItems?: ICD10Item[]
}

const DEPARTMENTS: { key: DepartmentKey | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả chuyên khoa' },
  { key: 'Mat', label: 'Mắt' },
  { key: 'TMH', label: 'Tai Mũi Họng' },
  { key: 'RHM', label: 'Răng Hàm Mặt' },
  { key: 'Noi', label: 'Nội khoa' },
  { key: 'Ngoai', label: 'Ngoại khoa & Vận động' },
  { key: 'DaLieu', label: 'Da liễu' },
  { key: 'TamThanKinh', label: 'Tâm thần kinh' },
  { key: 'PhuSan', label: 'Sản phụ khoa' }
]

const CHAPTERS: { key: string; label: string }[] = [
  { key: 'ALL', label: 'Tất cả 22 Chương ICD-10' },
  { key: 'I.', label: 'Chương I: Nhiễm trùng & Ký sinh trùng (A00-B99)' },
  { key: 'II.', label: 'Chương II: U tân sinh (C00-D48)' },
  { key: 'III.', label: 'Chương III: Bệnh máu & Tạo máu (D50-D89)' },
  { key: 'IV.', label: 'Chương IV: Nội tiết & Chuyển hoá (E00-E90)' },
  { key: 'V.', label: 'Chương V: Tâm thần & Hành vi (F00-F99)' },
  { key: 'VI.', label: 'Chương VI: Hệ thần kinh (G00-G99)' },
  { key: 'VII.', label: 'Chương VII: Mắt & Phần phụ (H00-H59)' },
  { key: 'VIII.', label: 'Chương VIII: Tai & Xương chũm (H60-H95)' },
  { key: 'IX.', label: 'Chương IX: Hệ tuần hoàn (I00-I99)' },
  { key: 'X.', label: 'Chương X: Hệ hô hấp (J00-J99)' },
  { key: 'XI.', label: 'Chương XI: Hệ tiêu hóa (K00-K93)' },
  { key: 'XII.', label: 'Chương XII: Da & Mô dưới da (L00-L99)' },
  { key: 'XIII.', label: 'Chương XIII: Cơ xương khớp (M00-M99)' },
  { key: 'XIV.', label: 'Chương XIV: Tiết niệu & Sinh dục (N00-N99)' },
  { key: 'XIX.', label: 'Chương XIX: Chấn thương & Ngộ độc (S00-T98)' },
  { key: 'XXI.', label: 'Chương XXI: Yếu tố ảnh hưởng SK (Z00-Z99)' }
]

const HighlightedText: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  if (!query || !query.trim()) return <>{text}</>
  const parts = splitForHighlight(text, query)
  return (
    <>
      {parts.map((p, idx) =>
        p.isMatch ? (
          <mark key={idx} className="bg-amber-100 text-amber-900 font-bold px-0.5 rounded">
            {p.text}
          </mark>
        ) : (
          <span key={idx}>{p.text}</span>
        )
      )}
    </>
  )
}

export const ICDSearch: React.FC<ICDSearchProps> = ({
  onSelectForAssessment,
  selectedItems = []
}) => {
  const [allData, setAllData] = useState<ICD10Item[]>(ICD10_DATABASE)
  const [isLoadingFull, setIsLoadingFull] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState('')
  const deferredQuery = useDeferredValue(searchTerm)

  const [selectedDept, setSelectedDept] = useState<DepartmentKey | 'ALL'>('ALL')
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL')
  const [levelFilter, setLevelFilter] = useState<'ALL' | 'category3' | 'subcategory4'>('ALL')
  const [militaryFilter, setMilitaryFilter] = useState<'ALL' | 'eligible' | 'conditional' | 'ineligible'>('ALL')
  const [isCompactMode, setIsCompactMode] = useState(true)
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // Smooth pagination states
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(50)
  const resultsTopRef = useRef<HTMLDivElement>(null)

  // Load the full 13,190 dataset on mount
  useEffect(() => {
    let mounted = true
    getFullICD10().then((data) => {
      if (mounted) {
        setAllData(data)
        setIsLoadingFull(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  // Reset to page 1 whenever search query or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [deferredQuery, selectedDept, selectedChapter, levelFilter, militaryFilter, pageSize])

  // High-performance tokenized search (runs in <2ms on 13,190 items)
  const filteredItems = useMemo(() => {
    return searchICD10(allData, deferredQuery, selectedDept, militaryFilter, levelFilter, selectedChapter)
  }, [allData, deferredQuery, selectedDept, militaryFilter, levelFilter, selectedChapter])

  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1

  // Current page items
  const displayedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredItems.slice(startIndex, startIndex + pageSize)
  }, [filteredItems, currentPage, pageSize])

  const isAlreadySelected = (code: string) => {
    return selectedItems.some((i) => i.code === code)
  }

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => ({
      ...prev,
      [code]: !prev[code]
    }))
  }

  const handleCopyCode = (item: ICD10Item, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const textToCopy = `[${item.code}] ${item.nameVi}`
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedCode(item.code)
      setTimeout(() => setCopiedCode(null), 2000)
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (resultsTopRef.current) {
      const topOffset = resultsTopRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  const isStale = searchTerm !== deferredQuery

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-xs border border-slate-200 space-y-2.5">
        {/* Search input with 120fps smooth input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {isStale ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500 animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã (A00-Z99, ví dụ: I10, J200, E11) hoặc tên bệnh có/không dấu..."
            className="w-full pl-9 sm:pl-10 pr-12 py-2 sm:py-2.5 bg-slate-50 border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-slate-900 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Quick Popular Disease Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center">
            <Sparkles className="w-3 h-3 text-amber-500 mr-1 shrink-0" />
            Hay tra:
          </span>
          {POPULAR_DISEASES.map((p) => (
            <button
              key={p.query}
              onClick={() => setSearchTerm(p.query)}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 font-medium whitespace-nowrap transition-colors shrink-0 border border-slate-200"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Department Pills - Horizontal scroll on mobile */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept.key}
              onClick={() => setSelectedDept(dept.key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedDept === dept.key
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept.label}
            </button>
          ))}
        </div>

        {/* Multi-Filters: Chapter, Code Level & Military Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Chapter Dropdown Filter */}
            <div className="flex items-center space-x-1 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700 font-medium outline-none focus:border-sky-500 max-w-[200px] truncate"
              >
                {CHAPTERS.map((ch) => (
                  <option key={ch.key} value={ch.key}>
                    {ch.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Code Level Filter (3-character group vs 4-character detail) */}
            <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              <button
                type="button"
                onClick={() => setLevelFilter('ALL')}
                className={`px-2 py-0.5 rounded font-medium ${
                  levelFilter === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
              >
                Mọi cấp mã
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('category3')}
                className={`px-2 py-0.5 rounded font-medium ${
                  levelFilter === 'category3' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="Chỉ hiển thị mã nhóm 3 ký tự (Ví dụ: I10, J20, E11)"
              >
                Nhóm 3 ký tự
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('subcategory4')}
                className={`px-2 py-0.5 rounded font-medium ${
                  levelFilter === 'subcategory4' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
                }`}
                title="Chỉ hiển thị mã chi tiết 4-5 ký tự (Ví dụ: I10.0, J20.1)"
              >
                Chi tiết 4+ ký tự
              </button>
            </div>

            {/* Military Filter */}
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-slate-500 text-[11px] hidden lg:inline">Tuyển sinh QS:</span>
              <button
                onClick={() => setMilitaryFilter('ALL')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  militaryFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setMilitaryFilter('eligible')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  militaryFilter === 'eligible' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                Đủ ĐK
              </button>
              <button
                onClick={() => setMilitaryFilter('conditional')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  militaryFilter === 'conditional' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                Chỉ kỹ thuật
              </button>
              <button
                onClick={() => setMilitaryFilter('ineligible')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  militaryFilter === 'ineligible' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
                }`}
              >
                Không đạt
              </button>
            </div>
          </div>

          {/* Compact vs Detailed view toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setIsCompactMode(true)}
              className={`p-1 rounded flex items-center space-x-1 text-[11px] font-semibold ${
                isCompactMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Chế độ thu gọn danh sách (phù hợp điện thoại)"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gọn</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCompactMode(false)}
              className={`p-1 rounded flex items-center space-x-1 text-[11px] font-semibold ${
                !isCompactMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Chế độ thẻ chi tiết"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chi tiết</span>
            </button>
          </div>
        </div>
      </div>

      {/* Target anchor for smooth page scroll */}
      <div ref={resultsTopRef} className="-mt-2" />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center space-x-1.5">
          <span>
            Tìm thấy <strong className="text-slate-800 font-bold">{filteredItems.length.toLocaleString('vi-VN')}</strong> mã bệnh
            {searchTerm && <span> cho từ khóa &quot;<strong>{searchTerm}</strong>&quot;</span>}
          </span>
          {isLoadingFull && (
            <span className="inline-flex items-center text-sky-600 text-[10px]">
              <Loader2 className="w-3 h-3 animate-spin mr-1" />
              Đang tải CSDL đầy đủ...
            </span>
          )}
        </div>
        <span className="text-[11px] font-medium text-slate-600">
          Trang {currentPage} / {totalPages}
        </span>
      </div>

      {/* Disease List (Compact Mode for Mobile or Detailed Grid) */}
      <div key={`view-${isCompactMode ? 'compact' : 'detailed'}-${currentPage}`} className="tab-transition">
        {isCompactMode ? (
          <div className="space-y-1.5">
            {displayedItems.map((item) => {
              const selected = isAlreadySelected(item.code)
              const isExpanded = !!expandedCodes[item.code]
              const isCopied = copiedCode === item.code

              let scoreBadge = 'bg-emerald-100 text-emerald-800'
              if (item.tt105Score === 3) scoreBadge = 'bg-amber-100 text-amber-800'
              if (item.tt105Score >= 4) scoreBadge = 'bg-rose-100 text-rose-800'

              return (
                <div
                  key={item.code}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-sky-300 transition-all"
                >
                  {/* Compact Row */}
                  <div
                    onClick={() => toggleExpand(item.code)}
                    className="p-2.5 sm:p-3 cursor-pointer flex items-center justify-between gap-2 hover:bg-slate-50/70 select-none"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold text-xs rounded-md shrink-0">
                        <HighlightedText text={item.code} query={searchTerm} />
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          <HighlightedText text={item.nameVi} query={searchTerm} />
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.chapter.split('.')[0]} • <HighlightedText text={item.nameEn} query={searchTerm} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      {/* 1-Click Copy Code Button */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyCode(item, e)}
                        className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                        title="Sao chép mã và tên bệnh"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${scoreBadge}`}>
                        Đ.{item.tt105Score}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 hidden sm:inline">
                        Loại {item.tt32Category}
                      </span>
                      <div className="text-slate-400 pl-0.5">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details inside Compact Mode */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-100 bg-slate-50/70 space-y-2 text-xs animate-fade-in">
                      {/* Chapter info */}
                      <div className="text-[11px] text-slate-500 font-medium">
                        Chương: <strong className="text-slate-700">{item.chapter}</strong>
                      </div>

                      {/* TT105 */}
                      <div className="p-2.5 rounded-lg border bg-white border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 mr-1 text-sky-600" />
                            VBHN 88/VBHN-BQP (Quân sự):
                          </span>
                          <span className={`px-2 py-0.5 rounded font-black text-[11px] ${scoreBadge}`}>
                            Điểm {item.tt105Score}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.tt105Detail}</p>
                        {item.militaryAdmissionNote && (
                          <p className="text-[11px] font-semibold text-slate-800 pt-1 border-t border-slate-100">
                            • Tuyển sinh quân sự: {item.militaryAdmissionNote}
                          </p>
                        )}
                      </div>

                      {/* TT32 */}
                      <div className="p-2.5 rounded-lg border bg-white border-slate-200 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center text-[11px]">
                            <HeartPulse className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            TT 32/2023/TT-BYT (Lao động / Tuyển sinh):
                          </span>
                          <span className="px-2 py-0.5 rounded font-black text-[11px] bg-emerald-100 text-emerald-800">
                            Loại {item.tt32Category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.tt32Detail}</p>
                        {item.occupationalNote && (
                          <p className="text-[11px] text-slate-500 italic">
                            Khuyến nghị NLĐ: {item.occupationalNote}
                          </p>
                        )}
                      </div>

                      {/* Action button */}
                      {onSelectForAssessment && (
                        <button
                          type="button"
                          onClick={() => onSelectForAssessment(item)}
                          disabled={selected}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                            selected
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                              : 'bg-slate-900 hover:bg-sky-600 text-white shadow-xs'
                          }`}
                        >
                          {selected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã thêm vào hồ sơ đánh giá</span>
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>Thêm bệnh này vào hồ sơ đánh giá</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          /* Detailed Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayedItems.map((item) => {
              const selected = isAlreadySelected(item.code)
              const isCopied = copiedCode === item.code

              let scoreBg = 'bg-emerald-50 text-emerald-700 border-emerald-200'
              if (item.tt105Score === 3) scoreBg = 'bg-amber-50 text-amber-700 border-amber-200'
              if (item.tt105Score >= 4) scoreBg = 'bg-rose-50 text-rose-700 border-rose-200'

              let milBadge = (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Đủ ĐK Tuyển sinh
                </span>
              )
              if (item.militaryAdmissionStatus === 'conditional') {
                milBadge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Chỉ trường Kỹ thuật
                  </span>
                )
              } else if (item.militaryAdmissionStatus === 'ineligible') {
                milBadge = (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Không tuyển QS
                  </span>
                )
              }

              return (
                <div
                  key={item.code}
                  className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold text-xs rounded-md shadow-2xs">
                          <HighlightedText text={item.code} query={searchTerm} />
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(item, e)}
                          className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                          title="Sao chép mã"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                          {item.chapter.split('.')[0]}
                        </span>
                      </div>
                      <div>{milBadge}</div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 leading-snug">
                      <HighlightedText text={item.nameVi} query={searchTerm} />
                    </h3>
                    <p className="text-[11px] text-slate-400 italic mb-3">
                      <HighlightedText text={item.nameEn} query={searchTerm} />
                    </p>

                    <div className="space-y-2 mb-4 text-xs">
                      <div className={`p-2.5 rounded-lg border ${scoreBg} space-y-1`}>
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center text-[11px]">
                            <BookOpen className="w-3.5 h-3.5 mr-1" />
                            VBHN 88/VBHN-BQP:
                          </span>
                          <span className="px-2 py-0.5 bg-white/80 rounded font-black text-xs">
                            Điểm {item.tt105Score}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed opacity-90">{item.tt105Detail}</p>
                        {item.militaryAdmissionNote && (
                          <p className="text-[11px] font-semibold text-slate-800 pt-1 border-t border-black/10">
                            • Tuyển sinh: {item.militaryAdmissionNote}
                          </p>
                        )}
                      </div>

                      <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span className="flex items-center text-[11px]">
                            <HeartPulse className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            TT 32/2023/TT-BYT:
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-xs">
                            Loại {item.tt32Category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{item.tt32Detail}</p>
                      </div>
                    </div>
                  </div>

                  {onSelectForAssessment && (
                    <button
                      type="button"
                      onClick={() => onSelectForAssessment(item)}
                      disabled={selected}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                        selected
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                          : 'bg-slate-900 hover:bg-sky-600 text-white shadow-xs'
                      }`}
                    >
                      {selected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã thêm vào phiếu đánh giá</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Thêm vào phiếu đánh giá</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredItems.length}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize)
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
