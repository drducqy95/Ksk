import React, { useState } from 'react'
import type { AssessmentResult } from '../types'
import { TARGET_DESCRIPTIONS } from '../data/circularData'
import { CheckCircle2, AlertTriangle, XCircle, Printer, Copy, Check, ShieldCheck, HeartPulse, Activity, UserCheck } from 'lucide-react'

interface AssessmentResultProps {
  result: AssessmentResult
  onReevaluate: () => void
}

export const AssessmentResultView: React.FC<AssessmentResultProps> = ({
  result,
  onReevaluate
}) => {
  const [copied, setCopied] = useState(false)
  const targetMeta = TARGET_DESCRIPTIONS[result.target] || {
    title: 'Khám sức khỏe tổng quát',
    circular: 'Thông tư 105 & Thông tư 32',
    desc: ''
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const text = `
=== PHIẾU KẾT LUẬN XẾP LOẠI SỨC KHỎE ===
Đối tượng: ${targetMeta.title}
Căn cứ: ${targetMeta.circular}

1. Thể lực: BMI ${result.bmi} (${result.bmiStatus}) - ${result.physicalScore.detail}
2. Xếp loại theo TT 105/2023/TT-BQP: ${result.overallTT105.label}
   - Tuyển sinh quân sự: ${result.overallTT105.canJoinMilitaryAdmission ? 'ĐỦ ĐIỀU KIỆN' : 'KHÔNG ĐỦ ĐIỀU KIỆN / CHỈ TRƯỜNG KỸ THUẬT'}
3. Xếp loại theo TT 32/2023/TT-BYT: ${result.overallTT32.label}
   - Khả năng lao động: ${result.overallTT32.workFitness}

Chi tiết chuyên khoa:
${result.departmentResults.map((d) => `• ${d.nameVi}: Điểm ${d.scoreTT105} (TT105) / Loại ${d.categoryTT32} (TT32) - ${d.statusNote}`).join('\n')}

Cảnh báo:
${result.criticalWarnings.length > 0 ? result.criticalWarnings.map((w) => `! ${w}`).join('\n') : 'Không có cảnh báo đặc biệt.'}

Khuyến nghị:
${result.recommendations.length > 0 ? result.recommendations.map((r) => `- ${r}`).join('\n') : 'Duy trì lối sống lành mạnh, khám định kỳ hàng năm.'}
    `.trim()

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  // Color theme for TT105 Overall
  let tt105Color = 'bg-emerald-500 text-white'
  let tt105Border = 'border-emerald-500'
  if (result.overallTT105.score === 3) {
    tt105Color = 'bg-amber-500 text-white'
    tt105Border = 'border-amber-500'
  } else if (result.overallTT105.score >= 4) {
    tt105Color = 'bg-rose-600 text-white'
    tt105Border = 'border-rose-600'
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
      {/* Action bar (Hidden when printing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-900">Kết quả Đánh giá & Xếp loại Sức khỏe</h2>
          <p className="text-xs text-slate-500">Đối tượng: {targetMeta.title}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyText}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã sao chép!' : 'Sao chép kết luận'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In phiếu / Xuất PDF</span>
          </button>
          <button
            onClick={onReevaluate}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Đánh giá lại
          </button>
        </div>
      </div>

      {/* Main Report Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-2">
        {/* Certificate Header (Formal style) */}
        <div className="text-center pb-6 border-b border-slate-200">
          <div className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
            BẢNG TỔNG HỢP KẾT QUẢ KHÁM & PHÂN LOẠI SỨC KHỎE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            KẾT LUẬN XẾP LOẠI SỨC KHỎE
          </h1>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
            Căn cứ: <strong>{targetMeta.circular}</strong>
          </div>
        </div>

        {/* Dual Classification Cards: TT105 & TT32 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TT 105 Military Card */}
          <div className={`rounded-2xl p-5 border-2 ${tt105Border} bg-slate-50/50 flex flex-col justify-between`}>
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-sky-600" />
                  Theo TT 105/2023/TT-BQP
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${tt105Color}`}>
                  Loại {result.overallTT105.score}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {result.overallTT105.label}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {result.overallTT105.summaryNotes[0]}
              </p>
            </div>

            {/* Military Admission Verdict */}
            <div className="mt-2 pt-3 border-t border-slate-200/80">
              <div className="text-xs font-semibold text-slate-500 mb-1">Kết luận Tuyển sinh Quân sự:</div>
              {result.overallTT105.canJoinMilitaryAdmission ? (
                <div className="flex items-start text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0 text-emerald-600 mt-0.5" />
                  <span>ĐỦ ĐIỀU KIỆN tham gia xét tuyển tất cả các Học viện, Trường Sĩ quan Quân đội.</span>
                </div>
              ) : result.overallTT105.militaryAdmissionBranch === 'technical_only' ? (
                <div className="flex items-start text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0 text-amber-600 mt-0.5" />
                  <span>
                    CHỈ ĐỦ ĐIỀU KIỆN xét tuyển các trường Kỹ thuật (HV Kỹ thuật Quân sự, Học viện Quân y...) có quy chế riêng. Không đủ điều kiện trường Sĩ quan chỉ huy.
                  </span>
                </div>
              ) : (
                <div className="flex items-start text-xs font-bold text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <XCircle className="w-4 h-4 mr-1.5 shrink-0 text-rose-600 mt-0.5" />
                  <span>KHÔNG ĐỦ TIÊU CHUẨN sức khỏe xét tuyển vào các trường Quân đội.</span>
                </div>
              )}
            </div>
          </div>

          {/* TT 32 Ministry of Health Card */}
          <div className="rounded-2xl p-5 border-2 border-emerald-500 bg-emerald-50/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <HeartPulse className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Theo TT 32/2023/TT-BYT
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-600 text-white">
                  Loại {result.overallTT32.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {result.overallTT32.label}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                Áp dụng cho tuyển dụng xin việc, tuyển sinh dân sự và khám định kỳ người lao động.
              </p>
            </div>

            {/* Work fitness verdict */}
            <div className="mt-2 pt-3 border-t border-slate-200/80">
              <div className="text-xs font-semibold text-slate-500 mb-1">Khả năng bố trí công việc / Học tập:</div>
              <div className="flex items-start text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200">
                <UserCheck className="w-4 h-4 mr-1.5 shrink-0 text-emerald-600 mt-0.5" />
                <span>{result.overallTT32.workFitness}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warnings Section (if any) */}
        {result.criticalWarnings.length > 0 && (
          <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Các yếu tố cần lưu ý / Không đạt chuẩn:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-rose-700 space-y-1 pl-1">
              {result.criticalWarnings.map((warning, index) => (
                <li key={index} className="leading-relaxed font-medium">
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Department Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            <span>Chi tiết Đánh giá Từng Chuyên khoa</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Chuyên khoa</th>
                  <th className="py-2.5 px-3 text-center">TT 105 (Điểm)</th>
                  <th className="py-2.5 px-3 text-center">TT 32 (Loại)</th>
                  <th className="py-2.5 px-3">Tình trạng ghi nhận & Nhận xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {result.departmentResults.map((dept) => (
                  <tr key={dept.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {dept.nameVi}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-xs ${
                          dept.scoreTT105 <= 2
                            ? 'bg-emerald-100 text-emerald-800'
                            : dept.scoreTT105 === 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {dept.scoreTT105}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-800">
                        {dept.categoryTT32}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 leading-relaxed">
                      {dept.statusNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-700">
          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Khuyến nghị Chăm sóc & Theo dõi Sức khỏe:</span>
          </div>
          {result.recommendations.length > 0 ? (
            <ul className="list-disc list-inside space-y-1 pl-1">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="leading-relaxed">
                  {rec}
                </li>
              ))}
            </ul>
          ) : (
            <p className="leading-relaxed">
              Tình trạng sức khỏe ổn định. Duy trì chế độ dinh dưỡng hợp lý, luyện tập thể dục thể thao đều đặn và khám sức khỏe định kỳ tối thiểu 01 lần/năm.
            </p>
          )}
        </div>

        {/* Doctor Signature Block (Visible in print) */}
        <div className="hidden print:grid grid-cols-2 pt-12 text-center text-xs text-slate-800">
          <div>
            <div className="font-semibold">NGƯỜI ĐƯỢC KHÁM</div>
            <div className="italic text-slate-500">(Ký và ghi rõ họ tên)</div>
          </div>
          <div>
            <div className="font-bold">BÁC SĨ KẾT LUẬN / CHỦ TỊCH HỘI ĐỒNG</div>
            <div className="italic text-slate-500">(Ký, ghi rõ họ tên và đóng dấu)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
