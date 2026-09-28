import React, { useState, useEffect } from 'react'
import { Stethoscope, Search, Calculator, BookOpen, ShieldCheck, Download, Wifi, WifiOff } from 'lucide-react'

interface NavbarProps {
  activeTab: 'icd10' | 'classifier' | 'schools' | 'circulars'
  setActiveTab: (tab: 'icd10' | 'classifier' | 'schools' | 'circulars') => void
  installPrompt: any
  handleInstallClick: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  installPrompt,
  handleInstallClick
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('icd10')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-md shadow-sky-500/20">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  KSK PRO
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tra cứu ICD-10 & Xếp loại Sức khỏe theo Thông tư
              </p>
            </div>
          </div>

          {/* Navigation Tabs - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('icd10')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'icd10'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Tra cứu ICD-10</span>
            </button>

            <button
              onClick={() => setActiveTab('classifier')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'classifier'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Đánh giá Xếp loại</span>
            </button>

            <button
              onClick={() => setActiveTab('schools')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'schools'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tuyển sinh Quân sự</span>
            </button>

            <button
              onClick={() => setActiveTab('circulars')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'circulars'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Thông tư & Nghị định</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Online/Offline indicator */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
              title={isOnline ? 'Đang trực tuyến' : 'Đang hoạt động ngoại tuyến (Offline PWA)'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
            </div>

            {/* Install PWA Button */}
            {installPrompt && (
              <button
                onClick={handleInstallClick}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white rounded-lg text-xs font-semibold shadow-md shadow-sky-500/20 transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Cài đặt App</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('icd10')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'icd10'
                ? 'bg-sky-500 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Mã ICD-10</span>
          </button>

          <button
            onClick={() => setActiveTab('classifier')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'classifier'
                ? 'bg-sky-500 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Xếp loại</span>
          </button>

          <button
            onClick={() => setActiveTab('schools')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'schools'
                ? 'bg-sky-500 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Trường Quân sự</span>
          </button>

          <button
            onClick={() => setActiveTab('circulars')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium ${
              activeTab === 'circulars'
                ? 'bg-sky-500 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Thông tư</span>
          </button>
        </div>
      </div>
    </header>
  )
}
