import React, { useState } from 'react'
import { MILITARY_SCHOOLS } from '../data/militarySchools'
import { Eye, Ruler, Weight, Search, CheckCircle2 } from 'lucide-react'

export const MilitarySchoolsViewer: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'technical' | 'command'>('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSchools = MILITARY_SCHOOLS.filter((school) => {
    if (filter !== 'ALL' && school.category !== filter) return false
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        school.name.toLowerCase().includes(term) ||
        school.code.toLowerCase().includes(term) ||
        school.visionReq.toLowerCase().includes(term)
      )
    }
    return true
  })

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên trường (HVKTQS, Lục quân...)"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:border-sky-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Khối ngành:</span>
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({MILITARY_SCHOOLS.length})
          </button>
          <button
            onClick={() => setFilter('technical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'technical' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Khối Kỹ thuật (Cho phép cận &lt;= 3D)
          </button>
          <button
            onClick={() => setFilter('command')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'command' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Sĩ quan Chỉ huy (Không cận)
          </button>
        </div>
      </div>

      {/* Grid of Schools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchools.map((school) => {
          const isTech = school.category === 'technical'
          return (
            <div
              key={school.code}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-mono font-bold text-xs rounded-md">
                    {school.code}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      isTech ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                    }`}
                  >
                    {isTech ? 'Khối Kỹ thuật' : 'Sĩ quan Chỉ huy'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{school.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{school.note}</p>

                <div className="space-y-2 text-xs">
                  {/* Vision requirement */}
                  <div
                    className={`p-2.5 rounded-xl border ${
                      isTech
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/70 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center font-bold mb-1">
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      <span>Tiêu chuẩn Thị lực & Cận thị:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">{school.visionReq}</p>
                  </div>

                  {/* Physical requirements */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Ruler className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Chiều cao:</div>
                        <div>{school.heightReqMale}</div>
                        {school.heightReqFemale && <div>Nữ: {school.heightReqFemale}</div>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <Weight className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Cân nặng:</div>
                        <div>{school.weightReqMale}</div>
                        {school.weightReqFemale && <div>Nữ: {school.weightReqFemale}</div>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 mr-1" />
                  Yêu cầu Sức khỏe Loại 1 hoặc 2
                </span>
                <span>TT 105/2023/TT-BQP</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
