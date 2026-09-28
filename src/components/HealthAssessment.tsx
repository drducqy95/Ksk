import React, { useState } from 'react'
import type { AssessmentInput, AssessmentResult, ExamTarget, ICD10Item, PriorityGroup } from '../types'
import { classifyHealth, calculateBMI, getBMIStatus } from '../utils/healthClassifier'
import { TARGET_DESCRIPTIONS } from '../data/circularData'
import { ICD10_DATABASE } from '../data/icd10Data'
import { searchMatches } from '../utils/searchHelper'
import { Calculator, User, Eye, Sparkles, HeartPulse, Search, Trash2, Plus, Info, ShieldCheck, ChevronDown, ChevronUp, Activity, Check } from 'lucide-react'

interface HealthAssessmentProps {
  onClassified: (result: AssessmentResult) => void
  selectedDiseases: ICD10Item[]
  onRemoveDisease: (code: string) => void
  onAddDisease: (item: ICD10Item) => void
}

export const HealthAssessment: React.FC<HealthAssessmentProps> = ({
  onClassified,
  selectedDiseases,
  onRemoveDisease,
  onAddDisease
}) => {
  const [target, setTarget] = useState<ExamTarget>('tuyen-sinh-quan-su')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [priorityGroup, setPriorityGroup] = useState<PriorityGroup>('standard')
  const [height, setHeight] = useState<number>(170)
  const [weight, setWeight] = useState<number>(62)
  const [chest, setChest] = useState<number>(82)

  // Mắt
  const [rightEyeVision, setRightEyeVision] = useState<number>(10)
  const [leftEyeVision, setLeftEyeVision] = useState<number>(10)
  const [myopiaDiopters, setMyopiaDiopters] = useState<number>(0)
  const [astigmatismDiopters, setAstigmatismDiopters] = useState<number>(0)

  // Tuần hoàn
  const [systolicBP, setSystolicBP] = useState<number>(120)
  const [diastolicBP, setDiastolicBP] = useState<number>(80)
  const [pulse, setPulse] = useState<number>(75)

  // Răng hàm mặt
  const [cavitiesCount, setCavitiesCount] = useState<number>(0)
  const [lostTeethCount, setLostTeethCount] = useState<number>(0)

  // Tai Mũi Họng
  const [hearing, setHearing] = useState<'normal' | 'whisper_3_5m' | 'whisper_under_3m' | 'deaf'>('normal')
  const [chronicENT, setChronicENT] = useState<'none' | 'allergic_rhinitis' | 'sinusitis' | 'otitis_media'>('none')

  // Search in form
  const [diseaseSearch, setDiseaseSearch] = useState('')
  const [showDiseaseSearch, setShowDiseaseSearch] = useState(false)

  // Section Collapse States (default: Target open, Physical open, Specialties open)
  const [isTargetOpen, setIsTargetOpen] = useState(true)
  const [isPhysicalOpen, setIsPhysicalOpen] = useState(true)
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(true)
  const [isDiseasesOpen, setIsDiseasesOpen] = useState(true)

  const bmi = calculateBMI(height, weight)
  const bmiStatus = getBMIStatus(bmi)
  const currentTargetMeta = TARGET_DESCRIPTIONS[target]

  // Filter ICD items for inline search
  const searchedDiseases = diseaseSearch.trim()
    ? ICD10_DATABASE.filter(
        (d) =>
          !selectedDiseases.some((sd) => sd.code === d.code) &&
          (searchMatches(d.code, diseaseSearch) || searchMatches(d.nameVi, diseaseSearch))
      ).slice(0, 5)
    : []

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    const input: AssessmentInput = {
      target,
      gender,
      height,
      weight,
      chest,
      priorityGroup,
      rightEyeVision,
      leftEyeVision,
      myopiaDiopters,
      astigmatismDiopters,
      hyperopiaDiopters: 0,
      systolicBP,
      diastolicBP,
      pulse,
      cavitiesCount,
      lostTeethCount,
      hasDentalProsthesis: false,
      hearingLeft: hearing,
      hearingRight: hearing,
      chronicENT,
      selectedDiseases
    }

    const result = classifyHealth(input)
    onClassified(result)
  }

  return (
    <form onSubmit={handleCalculate} className="space-y-3.5 sm:space-y-5 max-w-4xl mx-auto pb-20 sm:pb-0">
      {/* 1. Target Selector Card (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setIsTargetOpen(!isTargetOpen)}
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50/70 select-none"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Đối Tượng Khám & Căn Cứ Áp Dụng</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Đang chọn: <strong className="text-sky-700">{currentTargetMeta.title}</strong>
              </p>
            </div>
          </div>
          <div className="text-slate-400 pl-2">
            {isTargetOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {isTargetOpen && (
          <div className="p-4 pt-0 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
              {(Object.keys(TARGET_DESCRIPTIONS) as ExamTarget[]).map((key) => {
                const item = TARGET_DESCRIPTIONS[key]
                const isSelected = target === key
                return (
                  <div
                    key={key}
                    onClick={() => setTarget(key)}
                    className={`cursor-pointer rounded-xl p-3 border transition-all text-left flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                    </div>
                    <div className="mt-2 pt-1.5 border-t border-slate-100 text-[10px] font-medium text-slate-600 flex items-center">
                      <Info className="w-3 h-3 mr-1 text-sky-500 shrink-0" />
                      <span className="truncate">{item.circular}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Physical Section (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setIsPhysicalOpen(!isPhysicalOpen)}
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50/70 select-none"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-4 h-4 text-sky-600" />
                <span>Chỉ Số Thể Lực (BMI, Chiều cao, Cân nặng)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {gender === 'male' ? 'Nam' : 'Nữ'} • {height}cm • {weight}kg • BMI: <strong className="text-slate-800">{bmi}</strong> ({bmiStatus})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                bmi >= 18.5 && bmi < 23
                  ? 'bg-emerald-100 text-emerald-800'
                  : bmi < 18.5
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              BMI {bmi}
            </span>
            <div className="text-slate-400">
              {isPhysicalOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {isPhysicalOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 space-y-3.5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Giới tính</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      gender === 'male' ? 'bg-sky-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Nam
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      gender === 'female' ? 'bg-pink-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chiều cao (cm)</label>
                <input
                  type="number"
                  min={130}
                  max={220}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-sky-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cân nặng (kg)</label>
                <input
                  type="number"
                  min={30}
                  max={160}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-sky-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Vòng ngực (cm)</label>
                <input
                  type="number"
                  min={60}
                  max={140}
                  value={chest}
                  onChange={(e) => setChest(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:border-sky-500 outline-none"
                />
              </div>
            </div>

            {target === 'tuyen-sinh-quan-su' && (
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Khu vực / Đối tượng tuyển sinh quân sự:
                </label>
                <select
                  value={priorityGroup}
                  onChange={(e) => setPriorityGroup(e.target.value as PriorityGroup)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-500 outline-none bg-slate-50"
                >
                  <option value="standard">Đối tượng thông thường (Nam ≥ 165cm, Nữ ≥ 154cm)</option>
                  <option value="kv1_island">Khu vực 1, hải đảo, dân tộc thiểu số (Nam ≥ 160cm, Nữ ≥ 152cm)</option>
                  <option value="minority_special">16 dân tộc thiểu số rất ít người (Nam ≥ 158cm, nặng ≥ 46kg)</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Specialty Checks (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setIsSpecialtyOpen(!isSpecialtyOpen)}
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50/70 select-none"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-sky-600" />
                <span>Khám Chuyên Khoa Lâm Sàng</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Mắt ({rightEyeVision}/{leftEyeVision}) • HA ({systolicBP}/{diastolicBP}) • Tim ({pulse}ck/p)
              </p>
            </div>
          </div>
          <div className="text-slate-400 pl-2">
            {isSpecialtyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {isSpecialtyOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {/* Mắt & Khúc xạ */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center text-sky-700">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Mắt & Khúc Xạ
                  </span>
                  <span className="text-[10px] text-slate-500">Thang điểm 10</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Mắt phải</label>
                    <select
                      value={rightEyeVision}
                      onChange={(e) => setRightEyeVision(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>
                          {v}/10
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Mắt trái</label>
                    <select
                      value={leftEyeVision}
                      onChange={(e) => setLeftEyeVision(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs"
                    >
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => (
                        <option key={v} value={v}>
                          {v}/10
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Độ Cận thị (D)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="15"
                      value={myopiaDiopters}
                      onChange={(e) => setMyopiaDiopters(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs"
                      placeholder="0 = Không cận"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Độ Loạn thị (D)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={astigmatismDiopters}
                      onChange={(e) => setAstigmatismDiopters(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs"
                      placeholder="0 = Không loạn"
                    />
                  </div>
                </div>
              </div>

              {/* Huyết áp & Tim mạch */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span className="flex items-center text-emerald-700">
                    <HeartPulse className="w-3.5 h-3.5 mr-1" />
                    Huyết Áp & Tuần Hoàn
                  </span>
                  <span className="text-[10px] text-slate-500">mmHg</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Tâm thu</label>
                    <input
                      type="number"
                      min={70}
                      max={240}
                      value={systolicBP}
                      onChange={(e) => setSystolicBP(Number(e.target.value))}
                      className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Tâm trương</label>
                    <input
                      type="number"
                      min={40}
                      max={150}
                      value={diastolicBP}
                      onChange={(e) => setDiastolicBP(Number(e.target.value))}
                      className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Nhịp tim</label>
                    <input
                      type="number"
                      min={40}
                      max={180}
                      value={pulse}
                      onChange={(e) => setPulse(Number(e.target.value))}
                      className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-md font-semibold text-xs text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Răng Hàm Mặt */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center text-sky-700">
                  <Activity className="w-3.5 h-3.5 mr-1" />
                  Răng Hàm Mặt
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Răng sâu chưa hàn</label>
                    <select
                      value={cavitiesCount}
                      onChange={(e) => setCavitiesCount(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-medium text-xs"
                    >
                      <option value={0}>0 răng</option>
                      <option value={1}>1 răng sâu</option>
                      <option value={2}>2 răng sâu</option>
                      <option value={3}>3-4 răng</option>
                      <option value={5}>≥ 5 răng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Răng đã mất</label>
                    <select
                      value={lostTeethCount}
                      onChange={(e) => setLostTeethCount(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-medium text-xs"
                    >
                      <option value={0}>0 răng</option>
                      <option value={1}>1 răng</option>
                      <option value={2}>2-3 răng</option>
                      <option value={4}>≥ 4 răng</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tai Mũi Họng */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-slate-900 flex items-center text-sky-700">
                  <Activity className="w-3.5 h-3.5 mr-1" />
                  Tai Mũi Họng
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Sức nghe nói thầm</label>
                    <select
                      value={hearing}
                      onChange={(e) => setHearing(e.target.value as any)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-medium text-xs"
                    >
                      <option value="normal">Bình thường (5m)</option>
                      <option value="whisper_3_5m">Giảm nhẹ (3-4.5m)</option>
                      <option value="whisper_under_3m">Giảm rõ (&lt;3m)</option>
                      <option value="deaf">Điếc nặng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-600 mb-0.5">Bệnh TMH mạn</label>
                    <select
                      value={chronicENT}
                      onChange={(e) => setChronicENT(e.target.value as any)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded-md font-medium text-xs"
                    >
                      <option value="none">Không có</option>
                      <option value="allergic_rhinitis">Viêm mũi dị ứng</option>
                      <option value="sinusitis">Viêm xoang mạn</option>
                      <option value="otitis_media">Viêm tai giữa</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Selected Diseases from ICD-10 (Collapsible) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setIsDiseasesOpen(!isDiseasesOpen)}
          className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50/70 select-none"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0">
              4
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Bệnh Lý Kèm Theo ({selectedDiseases.length})</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {selectedDiseases.length === 0
                  ? 'Chưa chọn bệnh lý nào (bấm để thêm)'
                  : `Đã chọn: ${selectedDiseases.map((d) => d.code).join(', ')}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setIsDiseasesOpen(true)
                setShowDiseaseSearch(!showDiseaseSearch)
              }}
              className="p-1 px-2 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thêm</span>
            </button>
            <div className="text-slate-400">
              {isDiseasesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {isDiseasesOpen && (
          <div className="p-4 pt-0 border-t border-slate-100 space-y-3">
            {/* Inline search bar */}
            {showDiseaseSearch && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 mt-3">
                <div className="relative">
                  <input
                    type="text"
                    value={diseaseSearch}
                    onChange={(e) => setDiseaseSearch(e.target.value)}
                    placeholder="Gõ mã hoặc tên bệnh (VD: B18.1, E11, tăng huyết áp...)"
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-sky-500 font-medium"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                {searchedDiseases.length > 0 && (
                  <div className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
                    {searchedDiseases.map((d) => (
                      <div
                        key={d.code}
                        className="p-2 flex items-center justify-between text-xs hover:bg-sky-50 transition-colors"
                      >
                        <div className="min-w-0 pr-2">
                          <strong className="text-sky-700 font-mono mr-1.5">[{d.code}]</strong>
                          <span className="font-semibold text-slate-800">{d.nameVi}</span>
                          <span className="text-[10px] text-slate-400 ml-1.5">
                            (Điểm {d.tt105Score})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            onAddDisease(d)
                            setDiseaseSearch('')
                          }}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[10px] font-bold shrink-0"
                        >
                          Chọn
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Selected disease tags */}
            {selectedDiseases.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedDiseases.map((disease) => (
                  <div
                    key={disease.code}
                    className="inline-flex items-center space-x-1.5 pl-2.5 pr-1 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs"
                  >
                    <span className="font-mono font-bold text-sky-700">[{disease.code}]</span>
                    <span className="font-medium text-slate-800 truncate max-w-[180px] sm:max-w-none">
                      {disease.nameVi}
                    </span>
                    <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-600 font-bold">
                      Điểm {disease.tt105Score}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveDisease(disease.code)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic mt-3">
                Chưa có bệnh lý nào được chọn. Hãy bấm "Thêm" hoặc tìm kiếm ở tab "Mã ICD-10".
              </p>
            )}
          </div>
        )}
      </div>

      {/* Primary Action Button (Desktop) */}
      <div className="hidden sm:block">
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98 cursor-pointer"
        >
          <Calculator className="w-5 h-5" />
          <span>KẾT LUẬN & XẾP LOẠI SỨC KHỎE NGAY</span>
        </button>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed sm:hidden bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 p-2.5 px-4 flex items-center justify-between shadow-2xl">
        <div className="min-w-0 pr-2">
          <div className="text-[10px] text-slate-400 truncate uppercase font-bold">
            {currentTargetMeta.title}
          </div>
          <div className="text-xs font-black text-slate-900">
            BMI {bmi} • {gender === 'male' ? 'Nam' : 'Nữ'}
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleCalculate()}
          className="py-2.5 px-4 bg-gradient-to-r from-sky-600 to-emerald-600 text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 shrink-0 active:scale-95"
        >
          <Check className="w-4 h-4" />
          <span>XẾP LOẠI NGAY</span>
        </button>
      </div>
    </form>
  )
}
