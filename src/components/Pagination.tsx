import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  const [jumpPage, setJumpPage] = useState<string>('')

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const delta = 1

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  const handleJump = (e: React.FormEvent) => {
    e.preventDefault()
    const p = parseInt(jumpPage, 10)
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      onPageChange(p)
      setJumpPage('')
    }
  }

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        {/* Info */}
        <div className="font-medium text-center sm:text-left">
          Hiển thị <strong>{startItem.toLocaleString('vi-VN')} - {endItem.toLocaleString('vi-VN')}</strong> trong tổng số <strong>{totalItems.toLocaleString('vi-VN')}</strong> kết quả
        </div>

        {/* Page size & jump */}
        <div className="flex items-center space-x-3 text-xs">
          {onPageSizeChange && (
            <div className="flex items-center space-x-1.5">
              <span className="text-slate-500">Mỗi trang:</span>
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          )}

          <form onSubmit={handleJump} className="flex items-center space-x-1">
            <span className="text-slate-500">Đến trang:</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              placeholder={`${currentPage}`}
              className="w-12 px-1.5 py-1 text-center bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
            >
              Đi
            </button>
          </form>
        </div>
      </div>

      {/* Page Buttons Bar */}
      <div className="flex items-center justify-center space-x-1 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none py-1">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Trang đầu"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Numbered page buttons */}
        {getPageNumbers().map((p, idx) => {
          if (p === '...') {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs">
                ...
              </span>
            )
          }

          const pageNum = p as number
          const isActive = pageNum === currentPage

          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-500'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {pageNum}
            </button>
          )
        })}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Trang tiếp"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Trang cuối"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
