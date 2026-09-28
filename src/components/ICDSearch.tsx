import React, { useState, useEffect, useMemo, useDeferredValue, useRef } from 'react'
import { ICD10_DATABASE } from '../data/icd10Data'
import { getFullICD10 } from '../utils/icdLoader'
import { searchICD10 } from '../utils/searchHelper'
import { Pagination } from './Pagination'
import type { ICD10Item, DepartmentKey } from '../types'
import { Search, PlusCircle, Check, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, BookOpen, ChevronDown, ChevronUp, LayoutGrid, List, Database, Loader2 } from 'lucide-react'

interface ICDSearchProps {
  onSelectForAssessment?: (item: ICD10Item) => void
  selectedItems?: ICD10Item[]
}

const DEPARTMENTS: { key: DepartmentKey | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'Mat', label: 'Mắt' },
  { key: 'TMH', label: 'Tai Mũi Họng' },
  { key: 'RHM', label: 'Răng Hàm Mặt' },
  { key: 'Noi', label: 'Nội khoa' },
  { key: 'Ngoai', label: 'Ngoại khoa & Vận động' },
  { key: 'DaLieu', label: 'Da liễu' },
  { key: 'TamThanKinh', label: 'Tâm thần kinh' },
  { key: 'PhuSan', label: 'Sản phụ khoa' }
]

export const ICDSearch: React.FC<ICDSearchProps> = ({
  onSelectForAssessment,
  selectedItems = []
}) => {
  const [allData, setAllData] = useState<ICD10Item[]>(ICD10_DATABASE)
  const [isLoadingFull, setIsLoadingFull] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState('')
  const deferredQuery = useDeferredValue(searchTerm)

  const [selectedDept, setSelectedDept] = useState<DepartmentKey | 'ALL'>('ALL')
  const [militaryFilter, setMilitaryFilter] = useState<'ALL' | 'eligible' | 'conditional' | 'ineligible'>('ALL')
  const [isCompactMode, setIsCompactMode] = useState(true)
  const [expandedCodes, setExpandedCodes] = useState<Record<string, boolean>>({})

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
  }, [deferredQuery, selectedDept, militaryFilter, pageSize])

  // High-performance tokenized search (runs in <2ms on 13,190 items)
  const filteredItems = useMemo(() => {
    return searchICD10(allData, deferredQuery, selectedDept, militaryFilter)
  }, [allData, deferredQuery, selectedDept, militaryFilter])

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Smooth scroll to top of search results
    if (resultsTopRef.current) {
      const topOffset = resultsTopRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: topOffset, behavior: 'smooth' })
    }
  }

  const isStale = searchTerm !== deferredQuery

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-950 p-5 sm:p-7 text-white shadow-xl border border-sky-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-semibold border border-sky-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Căn cứ VBHN 88/VBHN-BQP (18/11/2025) & Thông tư 32/2023/TT-BYT</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <Database className="w-3.5 h-3.5" />
              <span>Toàn bộ {allData.length.toLocaleString('vi-VN')} mã bệnh Bộ Y Tế</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1.5">
            Từ Điển ICD-10 Toàn Diện & Phân Loại Sức Khỏe
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tra cứu tốc độ cao toàn bộ 13,190 mã bệnh tật quốc tế ICD-10, tự động đối chiếu điểm số Quân sự (Điểm 1 - 6) và xếp loại người lao động (Loại I - V).
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 shadow-xs border border-slate-200 space-y-3">
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
            placeholder="Tìm tức thì trong 13,190 mã (nhập A00-Z99, từ khóa có dấu hoặc không dấu)..."
            className="w-full pl-9 sm:pl-10 pr-12 py-2.5 sm:py-3 bg-slate-50 border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-slate-900 text-xs sm:text-sm outline-none transition-all placeholder:text-slate-400 font-medium"
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

        {/* Department Pills - Horizontal scroll on mobile */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none">
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

        {/* Bottom controls: Military filter & View mode switch */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="font-semibold text-slate-500 mr-1 text-[11px]">Tuyển sinh QS:</span>
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
                        {item.code}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {item.nameVi}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {item.chapter.split('.')[0]} • {item.nameEn}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${scoreBadge}`}>
                        Đ.{item.tt105Score}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 hidden sm:inline">
                        Loại {item.tt32Category}
                      </span>
                      <div className="text-slate-400 pl-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details inside Compact Mode */}
                  {isExpanded && (
                    <div className="p-3 pt-0 border-t border-slate-100 bg-slate-50/70 space-y-2.5 text-xs animate-fade-in">
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
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{item.chapter.split('.')[0]}</span>
                      </div>
                      <div>{milBadge}</div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1 leading-snug">
                      {item.nameVi}
                    </h3>
                    <p className="text-[11px] text-slate-400 italic mb-3">{item.nameEn}</p>

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
              )
            })}
          </div>
        )}
      </div>

      {/* Smooth Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems.length}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize)
          setCurrentPage(1)
        }}
      />

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-xs">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800 mb-1">Không tìm thấy mã bệnh</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có kết quả nào phù hợp với từ khóa "{searchTerm}". Bạn có thể thử tìm theo mã (A00 - Z99) hoặc tên bệnh khác.
          </p>
        </div>
      )}
    </div>
  )
}
