import React, { useState } from 'react'
import { CIRCULARS } from '../data/circularData'
import { BookOpen, FileText, CheckCircle2, Shield, HeartPulse, Scale } from 'lucide-react'

export const CircularViewer: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('tt105-2023-bqp')

  const currentCircular = CIRCULARS.find((c) => c.id === selectedId) || CIRCULARS[0]

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-teal-800/40 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
          <Scale className="w-3.5 h-3.5" />
          <span>Hệ Thống Văn Bản Pháp Quy Y Tế & Quân Sự</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Căn Cứ Pháp Lý & Quy Định Xếp Loại Sức Khỏe
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Chi tiết nội dung Thông tư 105/2023/TT-BQP của Bộ Quốc phòng và Thông tư 32/2023/TT-BYT của Bộ Y tế, phương pháp tính điểm và quy trình phân loại sức khỏe.
        </p>
      </div>

      {/* Circular Tabs */}
      <div className="flex space-x-2 bg-slate-200/80 p-1.5 rounded-xl border border-slate-300">
        {CIRCULARS.map((c) => {
          const isActive = c.id === selectedId
          return (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center space-x-2 ${
                isActive ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.id.includes('bqp') ? (
                <Shield className="w-4 h-4 text-sky-600" />
              ) : (
                <HeartPulse className="w-4 h-4 text-emerald-600" />
              )}
              <span>{c.code}</span>
            </button>
          )
        })}
      </div>

      {/* Circular Detail View */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-md">
              {currentCircular.code}
            </span>
            <span className="text-xs text-slate-500">Cơ quan ban hành: <strong>{currentCircular.authority}</strong></span>
            <span className="text-xs text-slate-500">• Hiệu lực từ: <strong>{currentCircular.effectiveDate}</strong></span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            {currentCircular.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 italic">
            Thay thế: {currentCircular.replaces}
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
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-medium text-slate-700 flex items-start space-x-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grading System Description */}
        <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-xl text-xs text-sky-950 space-y-1">
          <div className="font-bold flex items-center space-x-1.5 text-sky-900">
            <FileText className="w-4 h-4 text-sky-600" />
            <span>Phương pháp tính điểm & Thang phân loại:</span>
          </div>
          <p className="leading-relaxed">{currentCircular.gradingSystem}</p>
        </div>

        {/* Key Provisions */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
            <BookOpen className="w-4 h-4 text-sky-600 mr-1.5" />
            <span>Các điều khoản & tiêu chuẩn quan trọng</span>
          </h3>

          <div className="space-y-3">
            {currentCircular.keyProvisions.map((provision, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h4 className="font-bold text-sm text-slate-900">{provision.title}</h4>
                <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line font-mono bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {provision.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
