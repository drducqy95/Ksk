import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { ICDSearch } from './components/ICDSearch'
import { HealthAssessment } from './components/HealthAssessment'
import { AssessmentResultView } from './components/AssessmentResult'
import { MilitarySchoolsViewer } from './components/MilitarySchoolsViewer'
import { CircularViewer } from './components/CircularViewer'
import type { ICD10Item, AssessmentResult } from './types'
import { ShieldCheck, HeartPulse, Search, Calculator, CheckCircle2 } from 'lucide-react'

export function App() {
  const [activeTab, setActiveTab] = useState<'icd10' | 'classifier' | 'schools' | 'circulars'>('icd10')
  const [selectedDiseases, setSelectedDiseases] = useState<ICD10Item[]>([])
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Capture PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = () => {
    if (!installPrompt) return
    installPrompt.prompt()
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setToastMessage('Ứng dụng KSK PRO đã được cài đặt thành công!')
      }
      setInstallPrompt(null)
    })
  }

  const handleAddDisease = (item: ICD10Item) => {
    if (!selectedDiseases.some((d) => d.code === item.code)) {
      setSelectedDiseases((prev) => [...prev, item])
      setToastMessage(`Đã thêm mã [${item.code}] ${item.nameVi} vào phiếu đánh giá!`)
      setTimeout(() => setToastMessage(null), 3000)
    }
  }

  const handleRemoveDisease = (code: string) => {
    setSelectedDiseases((prev) => prev.filter((d) => d.code !== code))
  }

  const handleClassified = (result: AssessmentResult) => {
    setAssessmentResult(result)
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
          // if switching to classifier while we have a result, keep it or allow viewing
        }}
        installPrompt={installPrompt}
        handleInstallClick={handleInstallClick}
      />

      {/* Main Body with Smooth Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-7">
        <div key={activeTab} className="tab-transition">
          {activeTab === 'icd10' && (
            <ICDSearch
              onSelectForAssessment={(item) => {
                handleAddDisease(item)
              }}
              selectedItems={selectedDiseases}
            />
          )}

          {activeTab === 'classifier' && (
            <div>
              {assessmentResult ? (
                <AssessmentResultView
                  result={assessmentResult}
                  onReevaluate={() => setAssessmentResult(null)}
                />
              ) : (
                <HealthAssessment
                  onClassified={handleClassified}
                  selectedDiseases={selectedDiseases}
                  onRemoveDisease={handleRemoveDisease}
                  onAddDisease={handleAddDisease}
                />
              )}
            </div>
          )}

          {activeTab === 'schools' && <MilitarySchoolsViewer />}

          {activeTab === 'circulars' && <CircularViewer />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-slate-700 flex items-center justify-center sm:justify-start space-x-1.5">
              <span>Hệ Thống KSK PRO - Tra cứu ICD-10 & Xếp loại Sức khỏe PWA</span>
            </div>
            <p>
              Căn cứ: <strong>Văn bản hợp nhất 88/VBHN-BQP</strong> (18/11/2025 - Hợp nhất TT 105 & TT 106) & <strong>Thông tư 32/2023/TT-BYT</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => setActiveTab('icd10')}
              className="hover:text-sky-600 transition-colors flex items-center space-x-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tra ICD-10</span>
            </button>
            <button
              onClick={() => setActiveTab('classifier')}
              className="hover:text-sky-600 transition-colors flex items-center space-x-1"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Đánh giá</span>
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className="hover:text-sky-600 transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trường Quân sự</span>
            </button>
            <button
              onClick={() => setActiveTab('circulars')}
              className="hover:text-sky-600 transition-colors flex items-center space-x-1"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Văn bản</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
