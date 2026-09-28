import React, { useState } from 'react'
import { CIRCULARS } from '../data/circularData'
import { BookOpen, CheckCircle2, Shield, HeartPulse, ChevronDown, ChevronUp, Layers } from 'lucide-react'

export const CircularViewer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('vbhn88-2025-bqp')
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({
    'Điều 4': true,
    'Điều 30': true,
    'Điều 1': true,
    'Điều 3': true
  })

  const currentCircular = CIRCULARS.find((c) => c.id === selectedId) || CIRCULARS[0]

  const toggleArticle = (art: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [art]: !prev[art]
    }))
  }

  const toggleAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {}
    currentCircular.articles.forEach((a) => {
      newState[a.article] = expand
    })
    setExpandedArticles(newState)
  }

  return (
    <div className="space-y-4 sm:space-y-5 max-w-5xl mx-auto">
      {/* Circular Tabs (Horizontal Scrollable on mobile) */}
      <div className="flex overflow-x-auto p-1.5 bg-slate-200/90 rounded-2xl border border-slate-300 space-x-1.5 scrollbar-none">
        {CIRCULARS.map((c) => {
          const isActive = c.id === selectedId
          const isMilitary = c.id.includes('bqp')
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              {isMilitary ? (
                <Shield className="w-4 h-4 text-sky-600 shrink-0" />
              ) : (
                <HeartPulse className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{c.code.split('&')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* Circular Detail View */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        {/* Document Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">
              {currentCircular.code}
            </span>
            <span className="text-xs text-slate-500">Cơ quan: <strong>{currentCircular.authority}</strong></span>
            <span className="text-xs text-slate-500">• Hiệu lực: <strong>{currentCircular.effectiveDate}</strong></span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentCircular.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 italic">
            Cơ sở pháp lý: {currentCircular.replaces}
          </p>
        </div>

        {/* Scope of Application */}
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            <span>Phạm vi áp dụng đối tượng</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentCircular.scope.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 flex items-start space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grading System Description */}
        <div className="p-3.5 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-950 space-y-1">
          <div className="font-bold flex items-center space-x-1.5 text-sky-900">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>Phương pháp tính điểm & Thang phân loại:</span>
          </div>
          <p className="leading-relaxed">{currentCircular.gradingSystem}</p>
        </div>

        {/* Key Articles (Collapsible Accordion on Mobile & Desktop) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <BookOpen className="w-4 h-4 text-sky-600 mr-1.5" />
              <span>Nội dung chi tiết các điều khoản ({currentCircular.articles.length} điều)</span>
            </h3>

            <div className="flex items-center space-x-2 text-[11px] font-semibold text-sky-700">
              <button
                type="button"
                onClick={() => toggleAll(true)}
                className="hover:underline"
              >
                Mở tất cả
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => toggleAll(false)}
                className="hover:underline text-slate-500"
              >
                Thu gọn
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {currentCircular.articles.map((item) => {
              const isExpanded = !!expandedArticles[item.article]
              return (
                <div
                  key={item.article}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleArticle(item.article)}
                    className="w-full p-3 sm:p-4 text-left flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs shrink-0">
                        {item.article}
                      </span>
                      <span className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</span>
                    </div>
                    <div className="text-slate-400 pl-2">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 sm:p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-mono bg-white p-3 rounded-lg border border-slate-200 mt-2 overflow-x-auto">
                        {item.content}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
