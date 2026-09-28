export type ExamTarget =
  | 'tuyen-sinh-quan-su'
  | 'dinh-ky-quan-nhan'
  | 'xin-viec-lam'
  | 'dinh-ky-lao-dong'
  | 'tuyen-sinh-hoc-tap'

export type DepartmentKey =
  | 'TheLuc'
  | 'Mat'
  | 'TMH'
  | 'RHM'
  | 'Noi'
  | 'Ngoai'
  | 'DaLieu'
  | 'TamThanKinh'
  | 'PhuSan'

export interface ICD10Item {
  code: string
  nameVi: string
  nameEn: string
  chapter: string
  department: DepartmentKey
  // Thông tư 105/2023/TT-BQP
  tt105Score: 1 | 2 | 3 | 4 | 5 | 6
  tt105Detail: string
  militaryAdmissionStatus: 'eligible' | 'conditional' | 'ineligible' // Đủ ĐK / ĐK riêng trường kỹ thuật / Không ĐK
  militaryAdmissionNote?: string
  // Thông tư 32/2023/TT-BYT
  tt32Category: 'I' | 'II' | 'III' | 'IV' | 'V'
  tt32Detail: string
  occupationalNote?: string

  // Fast Search Pre-indexes & Match Scoring
  _cleanCode?: string
  _cleanSearch?: string
  _rawCode?: string
  _matchPercent?: number
  _score?: number
}

export type PriorityGroup = 'standard' | 'kv1_island' | 'minority_special'

export interface AssessmentInput {
  target: ExamTarget
  gender: 'male' | 'female'
  height: number // cm
  weight: number // kg
  chest?: number // cm (vòng ngực trung bình)
  priorityGroup: PriorityGroup

  // Mắt - Khúc xạ
  rightEyeVision: number // thang 10
  leftEyeVision: number // thang 10
  isCorrectedVision?: boolean
  myopiaDiopters: number // Độ cận thị (0 = không cận)
  astigmatismDiopters: number // Độ loạn thị
  hyperopiaDiopters: number // Độ viễn thị

  // Tuần hoàn - Huyết áp
  systolicBP: number // Huyết áp tâm thu mmHg
  diastolicBP: number // Huyết áp tâm trương mmHg
  pulse: number // Nhịp tim l/phút

  // Răng hàm mặt
  cavitiesCount: number // Số răng sâu
  lostTeethCount: number // Số răng mất
  hasDentalProsthesis: boolean // Răng giả hàm

  // Tai Mũi Họng
  hearingLeft: 'normal' | 'whisper_3_5m' | 'whisper_under_3m' | 'deaf'
  hearingRight: 'normal' | 'whisper_3_5m' | 'whisper_under_3m' | 'deaf'
  chronicENT: 'none' | 'allergic_rhinitis' | 'sinusitis' | 'otitis_media'

  // Bệnh tật kèm theo từ ICD-10
  selectedDiseases: ICD10Item[]
}

export interface AssessmentResult {
  target: ExamTarget
  bmi: number
  bmiStatus: string
  physicalScore: {
    score: number // TT105 (1-6)
    categoryBYT: 'I' | 'II' | 'III' | 'IV' | 'V' // TT32
    detail: string
  }
  departmentResults: {
    key: DepartmentKey
    nameVi: string
    scoreTT105: number // 1-6
    categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
    statusNote: string
    isDisqualifyingMilitary?: boolean
  }[]
  overallTT105: {
    score: 1 | 2 | 3 | 4 | 5 | 6
    label: string
    canJoinMilitaryAdmission: boolean
    militaryAdmissionBranch: 'all' | 'technical_only' | 'none'
    summaryNotes: string[]
  }
  overallTT32: {
    category: 'I' | 'II' | 'III' | 'IV' | 'V'
    label: string
    workFitness: string
    summaryNotes: string[]
  }
  criticalWarnings: string[]
  recommendations: string[]
}
