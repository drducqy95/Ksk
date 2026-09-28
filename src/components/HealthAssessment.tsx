import React, { useState } from 'react'
import type { AssessmentInput, AssessmentResult, ExamTarget, ICD10Item, PriorityGroup } from '../types'
import { classifyHealth, calculateBMI, getBMIStatus } from '../utils/healthClassifier'
import { TARGET_DESCRIPTIONS } from '../data/circularData'
import { ICD10_DATABASE } from '../data/icd10Data'
import { searchMatches } from '../utils/searchHelper'
import { Calculator, User, Eye, Activity, Sparkles, HeartPulse, Search, Trash2, Plus, Info, ShieldCheck } from 'lucide-react'

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

  const bmi = calculateBMI(height, weight)
  const bmiStatus = getBMIStatus(bmi)

  // Filter ICD items for inline search
  const searchedDiseases = diseaseSearch.trim()
    ? ICD10_DATABASE.filter(
        (d) =>
          !selectedDiseases.some((sd) => sd.code === d.code) &&
          (searchMatches(d.code, diseaseSearch) || searchMatches(d.nameVi, diseaseSearch))
      ).slice(0, 5)
    : []

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()

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
    <form onSubmit={handleCalculate} className="space-y-6 max-w-4xl mx-auto">
      {/* Target Selector Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Bước 1: Chọn Đối Tượng Khám & Căn Cứ Áp Dụng</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(TARGET_DESCRIPTIONS) as ExamTarget[]).map((key) => {
            const item = TARGET_DESCRIPTIONS[key]
            const isSelected = target === key
            return (
              <div
                key={key}
                onClick={() => setTarget(key)}
                className={`cursor-pointer rounded-xl p-3.5 border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{item.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug line-clamp-2">{item.desc}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-600 flex items-center">
                  <Info className="w-3 h-3 mr-1 text-sky-500 shrink-0" />
                  <span className="truncate">{item.circular}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Physical Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Bước 2: Chỉ Số Thể Lực</span>
          </div>

          {/* Realtime BMI badge */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-lg text-xs">
            <span className="text-slate-500">BMI:</span>
            <strong className="text-slate-900 font-mono text-sm">{bmi}</strong>
            <span
              className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                bmi >= 18.5 && bmi < 23
                  ? 'bg-emerald-100 text-emerald-800'
                  : bmi < 18.5
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {bmiStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Giới tính</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  gender === 'male' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  gender === 'female' ? 'bg-pink-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chiều cao (cm)</label>
            <input
              type="number"
              min={130}
              max={220}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Cân nặng (kg)</label>
            <input
              type="number"
              min={30}
              max={160}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Vòng ngực (cm)</label>
            <input
              type="number"
              min={60}
              max={140}
              value={chest}
              onChange={(e) => setChest(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
            />
          </div>
        </div>

        {target === 'tuyen-sinh-quan-su' && (
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Khu vực / Đối tượng ưu tiên tuyển sinh quân sự:
            </label>
            <select
              value={priorityGroup}
              onChange={(e) => setPriorityGroup(e.target.value as PriorityGroup)}
              className="w-full sm:w-auto px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:border-sky-500 outline-none"
            >
              <option value="standard">Đối tượng thông thường (Nam ≥ 165cm, Nữ ≥ 154cm)</option>
              <option value="kv1_island">Khu vực 1, hải đảo, dân tộc thiểu số (Nam ≥ 160cm, Nữ ≥ 152cm)</option>
              <option value="minority_special">16 dân tộc thiểu số rất ít người (Nam ≥ 158cm, nặng ≥ 46kg)</option>
            </select>
          </div>
        )}
      </div>

      {/* Specialty Checks: Eye, Heart, ENT, Dental */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mắt & Khúc xạ */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Mắt & Khúc xạ</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mắt phải (thị lực/10)</label>
              <select
                value={rightEyeVision}
                onChange={(e) => setRightEyeVision(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {v}/10
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mắt trái (thị lực/10)</label>
              <select
                value={leftEyeVision}
                onChange={(e) => setLeftEyeVision(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => (
                  <option key={v} value={v}>
                    {v}/10
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Độ Cận thị (Đi-ốp)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="15"
                value={myopiaDiopters}
                onChange={(e) => setMyopiaDiopters(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
                placeholder="0 nếu không cận"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Độ Loạn thị (Đi-ốp)</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="10"
                value={astigmatismDiopters}
                onChange={(e) => setAstigmatismDiopters(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
                placeholder="0 nếu không loạn"
              />
            </div>
          </div>
          {myopiaDiopters > 0 && myopiaDiopters <= 3.0 && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg leading-tight">
              * Lưu ý: Cận thị dưới 3.0D chỉ được xét tuyển vào các trường Kỹ thuật quân đội (HVKTQS, HVQY...) nếu thị lực chỉnh kính đạt 10/10.
            </p>
          )}
        </div>

        {/* Huyết áp & Tim mạch */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <HeartPulse className="w-4 h-4" />
            <span>Huyết Áp & Tuần Hoàn</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tâm thu (mmHg)</label>
              <input
                type="number"
                min={70}
                max={240}
                value={systolicBP}
                onChange={(e) => setSystolicBP(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-medium text-center"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tâm trương (mmHg)</label>
              <input
                type="number"
                min={40}
                max={150}
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-medium text-center"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nhịp tim (ck/phút)</label>
              <input
                type="number"
                min={40}
                max={180}
                value={pulse}
                onChange={(e) => setPulse(Number(e.target.value))}
                className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-medium text-center"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Huyết áp chuẩn: 110-129 / 70-84 mmHg. Huyết áp &gt;= 140/90 mmHg là Tăng huyết áp.
          </p>
        </div>

        {/* Răng Hàm Mặt */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Răng Hàm Mặt</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số răng sâu chưa hàn</label>
              <select
                value={cavitiesCount}
                onChange={(e) => setCavitiesCount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value={0}>Không có (0 răng)</option>
                <option value={1}>1 răng sâu độ 1-2</option>
                <option value={2}>2 răng sâu</option>
                <option value={3}>3-4 răng sâu</option>
                <option value={5}>Từ 5 răng trở lên</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Số răng đã mất</label>
              <select
                value={lostTeethCount}
                onChange={(e) => setLostTeethCount(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value={0}>Đầy đủ (0 răng)</option>
                <option value={1}>Mất 1 răng</option>
                <option value={2}>Mất 2-3 răng</option>
                <option value={4}>Mất &gt;= 4 răng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tai Mũi Họng */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
            <Activity className="w-4 h-4" />
            <span>Tai Mũi Họng</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sức nghe (Nói thầm)</label>
              <select
                value={hearing}
                onChange={(e) => setHearing(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value="normal">Bình thường (5m)</option>
                <option value="whisper_3_5m">Giảm nhẹ (3 - 4.5m)</option>
                <option value="whisper_under_3m">Giảm rõ (&lt; 3m)</option>
                <option value="deaf">Điếc nặng</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bệnh TMH mạn tính</label>
              <select
                value={chronicENT}
                onChange={(e) => setChronicENT(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-medium"
              >
                <option value="none">Không có</option>
                <option value="allergic_rhinitis">Viêm mũi dị ứng nhẹ</option>
                <option value="sinusitis">Viêm xoang mạn tính</option>
                <option value="otitis_media">Viêm tai giữa / thủng nhĩ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Diseases Section from ICD-10 */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-sky-600 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Bước 3: Bệnh Mắc Kèm Theo Mã ICD-10 ({selectedDiseases.length})</span>
          </div>

          <button
            type="button"
            onClick={() => setShowDiseaseSearch(!showDiseaseSearch)}
            className="flex items-center space-x-1.5 px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm bệnh lý</span>
          </button>
        </div>

        {/* Inline Disease Search Box */}
        {showDiseaseSearch && (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="relative">
              <input
                type="text"
                value={diseaseSearch}
                onChange={(e) => setDiseaseSearch(e.target.value)}
                placeholder="Gõ mã hoặc tên bệnh cần thêm (VD: B18.1 viêm gan B, E11 đái tháo đường...)"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-sky-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {searchedDiseases.length > 0 && (
              <div className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                {searchedDiseases.map((d) => (
                  <div
                    key={d.code}
                    className="p-2 flex items-center justify-between text-xs hover:bg-sky-50 transition-colors"
                  >
                    <div>
                      <strong className="text-sky-700 font-mono mr-2">[{d.code}]</strong>
                      <span className="font-semibold text-slate-800">{d.nameVi}</span>
                      <span className="text-[10px] text-slate-400 ml-2">(TT105: Điểm {d.tt105Score})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddDisease(d)
                        setDiseaseSearch('')
                      }}
                      className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold"
                    >
                      Chọn
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Display selected disease tags */}
        {selectedDiseases.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedDiseases.map((disease) => (
              <div
                key={disease.code}
                className="inline-flex items-center space-x-2 pl-2.5 pr-1.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs"
              >
                <span className="font-mono font-bold text-sky-700">[{disease.code}]</span>
                <span className="font-medium text-slate-800">{disease.nameVi}</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-600 font-semibold">
                  Điểm {disease.tt105Score}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveDisease(disease.code)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                  title="Xóa bệnh này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Chưa có bệnh lý mắc kèm nào được chọn. Nếu có chẩn đoán bệnh tật, hãy bấm "Thêm bệnh lý" hoặc chọn từ mục "Tra cứu ICD-10".
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-2 transition-all transform active:scale-98 cursor-pointer"
      >
        <Calculator className="w-5 h-5" />
        <span>KẾT LUẬN & XẾP LOẠI SỨC KHỎE NGAY</span>
      </button>
    </form>
  )
}
