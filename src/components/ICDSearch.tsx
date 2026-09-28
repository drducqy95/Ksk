import React, { useState, useMemo } from 'react'
import { ICD10_DATABASE } from '../data/icd10Data'
import type { ICD10Item, DepartmentKey } from '../types'
import { searchMatches } from '../utils/searchHelper'
import { Search, Filter, PlusCircle, Check, AlertTriangle, ShieldCheck, HeartPulse, Sparkles, BookOpen } from 'lucide-react'

interface ICDSearchProps {
  onSelectForAssessment?: (item: ICD10Item) => void
  selectedItems?: ICD10Item[]
}

const DEPARTMENTS: { key: DepartmentKey | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Tất cả chuyên khoa' },
  { key: 'Mat', label: 'Mắt & Khúc xạ' },
  { key: 'TMH', label: 'Tai Mũi Họng' },
  { key: 'RHM', label: 'Răng Hàm Mặt' },
  { key: 'Noi', label: 'Nội khoa & Tim mạch' },
  { key: 'Ngoai', label: 'Ngoại khoa & Vận động' },
  { key: 'DaLieu', label: 'Da liễu' },
  { key: 'TamThanKinh', label: 'Tâm thần kinh' }
]

export const ICDSearch: React.FC<ICDSearchProps> = ({
  onSelectForAssessment,
  selectedItems = []
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDept, setSelectedDept] = useState<DepartmentKey | 'ALL'>('ALL')
  const [militaryFilter, setMilitaryFilter] = useState<'ALL' | 'eligible' | 'conditional' | 'ineligible'>('ALL')

  const filteredItems = useMemo(() => {
    return ICD10_DATABASE.filter((item) => {
      // Search match
      const matchQuery =
        searchMatches(item.code, searchTerm) ||
        searchMatches(item.nameVi, searchTerm) ||
        searchMatches(item.nameEn, searchTerm) ||
        searchMatches(item.chapter, searchTerm)

      if (!matchQuery) return false

      // Department filter
      if (selectedDept !== 'ALL' && item.department !== selectedDept) {
        return false
      }

      // Military status filter
      if (militaryFilter !== 'ALL' && item.militaryAdmissionStatus !== militaryFilter) {
        return false
      }

      return true
    })
  }, [searchTerm, selectedDept, militaryFilter])

  const isAlreadySelected = (code: string) => {
    return selectedItems.some((i) => i.code === code)
  }

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-sky-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold mb-3 border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Căn cứ VBHN 88/VBHN-BQP (18/11/2025) & Thông tư 32/2023/TT-BYT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Tra Cứu Bệnh & Mã ICD-10
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Tra cứu nhanh mã bệnh quốc tế ICD-10, xem điểm phân loại sức khỏe quân sự (Điểm 1 - 6), tiêu chuẩn tuyển sinh quân sự và xếp loại người lao động theo Bộ Y tế.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã bệnh (VD: I10, H52.1, E11...) hoặc tên bệnh (tăng huyết áp, cận thị, viêm xoang...)"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 rounded-xl text-slate-900 text-sm outline-none transition-all placeholder:text-slate-400"
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <div className="flex items-center text-xs font-semibold text-slate-500 mr-2">
            <Filter className="w-3.5 h-3.5 mr-1" />
            <span>Lọc:</span>
          </div>

          {/* Department pills */}
          <div className="flex flex-wrap gap-1.5">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.key}
                onClick={() => setSelectedDept(dept.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedDept === dept.key
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.label}
              </button>
            ))}
          </div>
        </div>

        {/* Admission filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Tuyển sinh Quân sự:</span>
          <button
            onClick={() => setMilitaryFilter('ALL')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              militaryFilter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setMilitaryFilter('eligible')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              militaryFilter === 'eligible' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Đủ điều kiện (Điểm 1 - 2)
          </button>
          <button
            onClick={() => setMilitaryFilter('conditional')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              militaryFilter === 'conditional' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Có điều kiện / Chỉ trường kỹ thuật
          </button>
          <button
            onClick={() => setMilitaryFilter('ineligible')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              militaryFilter === 'ineligible' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Không đạt (Điểm 4 - 6)
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Tìm thấy <strong className="text-slate-800 font-bold">{filteredItems.length}</strong> mã bệnh phù hợp</span>
        <span>Cập nhật VBHN 88/VBHN-BQP (18/11/2025) & TT 32/2023/TT-BYT</span>
      </div>

      {/* Disease Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const selected = isAlreadySelected(item.code)

          // Color tags based on TT105 score
          let scoreBg = 'bg-emerald-50 text-emerald-700 border-emerald-200'
          if (item.tt105Score === 3) scoreBg = 'bg-amber-50 text-amber-700 border-amber-200'
          if (item.tt105Score >= 4) scoreBg = 'bg-rose-50 text-rose-700 border-rose-200'

          // Military status badge
          let milBadge = (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Đủ ĐK Tuyển sinh QS
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
                Không tuyển Quân sự
              </span>
            )
          }

          return (
            <div
              key={item.code}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header row: Code & Badges */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 font-mono font-bold text-sm rounded-lg shadow-sm">
                      {item.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{item.chapter.split('.')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">{milBadge}</div>
                </div>

                {/* Disease Name */}
                <h3 className="font-bold text-slate-900 text-base mb-1 leading-snug">
                  {item.nameVi}
                </h3>
                <p className="text-xs text-slate-400 italic mb-3">{item.nameEn}</p>

                {/* Classification info box */}
                <div className="space-y-2 mb-4 text-xs">
                  {/* TT 105 */}
                  <div className={`p-2.5 rounded-lg border ${scoreBg} space-y-1`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center">
                        <BookOpen className="w-3.5 h-3.5 mr-1" />
                        TT 105/2023/TT-BQP:
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

                  {/* TT 32 */}
                  <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-700 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center">
                        <HeartPulse className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        TT 32/2023/TT-BYT (Lao động / Tuyển sinh):
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-black text-xs">
                        Loại {item.tt32Category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.tt32Detail}</p>
                    {item.occupationalNote && (
                      <p className="text-[11px] text-slate-500 italic">
                        Khuyến nghị: {item.occupationalNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {onSelectForAssessment && (
                <button
                  onClick={() => onSelectForAssessment(item)}
                  disabled={selected}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    selected
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 cursor-default'
                      : 'bg-slate-900 hover:bg-sky-600 text-white shadow-sm'
                  }`}
                >
                  {selected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã thêm vào hồ sơ đánh giá</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Thêm bệnh này vào hồ sơ đánh giá</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">Không tìm thấy mã bệnh</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Không có kết quả nào phù hợp với từ khóa "{searchTerm}". Bạn có thể thử tìm theo mã hoặc tên bệnh khác.
          </p>
        </div>
      )}
    </div>
  )
}
