import type { AssessmentInput, AssessmentResult, DepartmentKey } from '../types'

export function calculateBMI(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg) return 0
  const heightM = heightCm / 100
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1))
}

export function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return 'Gầy / Thiếu cân'
  if (bmi < 23) return 'Bình thường (Chuẩn châu Á)'
  if (bmi < 25) return 'Thừa cân nhẹ (Tiền béo phì)'
  if (bmi < 30) return 'Béo phì độ I'
  if (bmi < 35) return 'Béo phì độ II'
  return 'Béo phì độ III (Nặng)'
}

export function evaluatePhysicalTT105(
  gender: 'male' | 'female',
  height: number,
  weight: number,
  chest: number = 80,
  bmi: number
): { score: 1 | 2 | 3 | 4 | 5 | 6; detail: string } {
  if (gender === 'male') {
    if (height >= 163 && weight >= 51 && chest >= 81 && bmi >= 18.5 && bmi <= 24.9) {
      return { score: 1, detail: 'Thể lực rất tốt (Cao >= 163cm, Nặng >= 51kg, Ngực >= 81cm, BMI chuẩn)' }
    }
    if (height >= 160 && weight >= 47 && chest >= 78 && bmi >= 18.0 && bmi <= 26.9) {
      return { score: 2, detail: 'Thể lực tốt (Cao 160-162cm hoặc nặng 47-50kg)' }
    }
    if (height >= 157 && weight >= 43 && chest >= 75 && bmi >= 17.5 && bmi <= 29.9) {
      return { score: 3, detail: 'Thể lực khá (Cao 157-159cm hoặc nặng 43-46kg)' }
    }
    if (height >= 155 && weight >= 41) {
      return { score: 4, detail: 'Thể lực trung bình (Cao 155-156cm hoặc nặng 41-42kg)' }
    }
    if (height >= 153 && weight >= 39) {
      return { score: 5, detail: 'Thể lực kém (Cao 153-154cm hoặc nặng 39-40kg)' }
    }
    return { score: 6, detail: 'Thể lực rất kém (Cao <= 152cm, Nặng <= 38kg hoặc BMI >= 30)' }
  } else {
    // Female
    if (height >= 154 && weight >= 48 && bmi >= 18.5 && bmi <= 24.9) {
      return { score: 1, detail: 'Thể lực rất tốt (Cao >= 154cm, Nặng >= 48kg, BMI chuẩn)' }
    }
    if (height >= 152 && weight >= 44 && bmi >= 18.0 && bmi <= 26.9) {
      return { score: 2, detail: 'Thể lực tốt (Cao 152-153cm hoặc nặng 44-47kg)' }
    }
    if (height >= 150 && weight >= 42 && bmi >= 17.5 && bmi <= 29.9) {
      return { score: 3, detail: 'Thể lực khá (Cao 150-151cm hoặc nặng 42-43kg)' }
    }
    if (height >= 148 && weight >= 40) {
      return { score: 4, detail: 'Thể lực trung bình (Cao 148-149cm hoặc nặng 40-41kg)' }
    }
    if (height >= 146 && weight >= 38) {
      return { score: 5, detail: 'Thể lực kém (Cao 146-147cm hoặc nặng 38-39kg)' }
    }
    return { score: 6, detail: 'Thể lực rất kém (Cao <= 145cm, Nặng <= 37kg hoặc BMI >= 30)' }
  }
}

export function evaluatePhysicalTT32(
  bmi: number,
  height: number,
  weight: number
): { category: 'I' | 'II' | 'III' | 'IV' | 'V'; detail: string } {
  if (bmi >= 18.5 && bmi <= 24.9 && height >= 160 && weight >= 48) {
    return { category: 'I', detail: 'Thể lực Loại I (Chỉ số thể hình cân đối, đáp ứng mọi loại hình công việc)' }
  }
  if (bmi >= 18.0 && bmi <= 26.5 && height >= 155 && weight >= 44) {
    return { category: 'II', detail: 'Thể lực Loại II (Tốt, phù hợp làm việc môi trường bình thường)' }
  }
  if (bmi >= 17.0 && bmi <= 29.9 && height >= 150 && weight >= 40) {
    return { category: 'III', detail: 'Thể lực Loại III (Trung bình, thích hợp công việc nhẹ, tránh quá sức)' }
  }
  if (bmi < 17.0 || (bmi >= 30 && bmi < 35)) {
    return { category: 'IV', detail: 'Thể lực Loại IV (Kém, nhẹ cân nhiều hoặc béo phì độ 1)' }
  }
  return { category: 'V', detail: 'Thể lực Loại V (Rất kém, suy nhược thể chất hoặc béo phì nặng)' }
}

export function evaluateEye(input: AssessmentInput): {
  scoreTT105: 1 | 2 | 3 | 4 | 5 | 6
  categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
  detail: string
  disqualifiesMilitaryAdmissions: boolean
  admissibleToTechnicalMilitaryOnly: boolean
} {
  const right = input.rightEyeVision
  const left = input.leftEyeVision
  const total = right + left
  const myopia = input.myopiaDiopters || 0
  const astigmatism = input.astigmatismDiopters || 0

  let scoreTT105: 1 | 2 | 3 | 4 | 5 | 6 = 1
  let categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V' = 'I'
  let detail = ''
  let disqualifiesMilitaryAdmissions = false
  let admissibleToTechnicalMilitaryOnly = false

  // Refraction check
  if (myopia > 0 || astigmatism > 0) {
    if (astigmatism >= 1.0) {
      scoreTT105 = 4
      categoryTT32 = 'III'
      detail = `Loạn thị ${astigmatism}D (Điểm 4 theo TT 105)`
      disqualifiesMilitaryAdmissions = true
    } else if (astigmatism > 0 && astigmatism < 1.0) {
      scoreTT105 = 3
      categoryTT32 = 'II'
      detail = `Loạn thị nhẹ ${astigmatism}D (Điểm 3)`
      disqualifiesMilitaryAdmissions = true
    }

    if (myopia > 0) {
      if (myopia < 1.5) {
        scoreTT105 = Math.max(scoreTT105, 2) as 1 | 2 | 3 | 4 | 5 | 6
        categoryTT32 = 'II'
        detail = `Cận thị nhẹ ${myopia}D (Điểm 2)`
        admissibleToTechnicalMilitaryOnly = true
      } else if (myopia < 3.0) {
        scoreTT105 = Math.max(scoreTT105, 3) as 1 | 2 | 3 | 4 | 5 | 6
        categoryTT32 = 'II'
        detail = `Cận thị vừa ${myopia}D (Điểm 3)`
        admissibleToTechnicalMilitaryOnly = true
      } else if (myopia < 4.0) {
        scoreTT105 = Math.max(scoreTT105, 4) as 1 | 2 | 3 | 4 | 5 | 6
        categoryTT32 = 'III'
        detail = `Cận thị ${myopia}D (Điểm 4 - Không đạt tuyển sinh QS)`
        disqualifiesMilitaryAdmissions = true
      } else if (myopia < 5.0) {
        scoreTT105 = Math.max(scoreTT105, 5) as 1 | 2 | 3 | 4 | 5 | 6
        categoryTT32 = 'IV'
        detail = `Cận thị nặng ${myopia}D (Điểm 5)`
        disqualifiesMilitaryAdmissions = true
      } else {
        scoreTT105 = 6
        categoryTT32 = 'V'
        detail = `Cận thị rất nặng ${myopia}D (Điểm 6)`
        disqualifiesMilitaryAdmissions = true
      }
    }
  } else {
    // Không tật khúc xạ
    if (right === 10 && left === 10) {
      scoreTT105 = 1
      categoryTT32 = 'I'
      detail = 'Thị lực 10/10 cả 2 mắt, không tật khúc xạ (Điểm 1)'
    } else if (total >= 19) {
      scoreTT105 = 2
      categoryTT32 = 'I'
      detail = `Thị lực 2 mắt ${right}/10 và ${left}/10 (Tổng ${total}/10 - Điểm 2)`
    } else if (total >= 16) {
      scoreTT105 = 3
      categoryTT32 = 'II'
      detail = `Thị lực 2 mắt ${right}/10 và ${left}/10 (Tổng ${total}/10 - Điểm 3)`
    } else if (total >= 13) {
      scoreTT105 = 4
      categoryTT32 = 'III'
      detail = `Thị lực giảm (Tổng ${total}/10 - Điểm 4)`
      disqualifiesMilitaryAdmissions = true
    } else {
      scoreTT105 = 5
      categoryTT32 = 'IV'
      detail = `Thị lực yếu (Tổng ${total}/10 - Điểm 5)`
      disqualifiesMilitaryAdmissions = true
    }
  }

  return {
    scoreTT105,
    categoryTT32,
    detail,
    disqualifiesMilitaryAdmissions,
    admissibleToTechnicalMilitaryOnly
  }
}

export function evaluateCirculation(input: AssessmentInput): {
  scoreTT105: 1 | 2 | 3 | 4 | 5 | 6
  categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
  detail: string
} {
  const s = input.systolicBP
  const d = input.diastolicBP
  const p = input.pulse

  if (s >= 180 || d >= 110) {
    return { scoreTT105: 6, categoryTT32: 'V', detail: `Tăng huyết áp độ 3 (${s}/${d} mmHg - Nguy hiểm)` }
  }
  if (s >= 160 || d >= 100) {
    return { scoreTT105: 5, categoryTT32: 'IV', detail: `Tăng huyết áp độ 2 (${s}/${d} mmHg - Điểm 5)` }
  }
  if (s >= 140 || d >= 90) {
    return { scoreTT105: 4, categoryTT32: 'III', detail: `Tăng huyết áp độ 1 (${s}/${d} mmHg - Điểm 4)` }
  }
  if (s >= 130 || d >= 85) {
    return { scoreTT105: 3, categoryTT32: 'II', detail: `Tiền tăng huyết áp (${s}/${d} mmHg - Điểm 3)` }
  }
  if (p < 50 || p > 100) {
    return { scoreTT105: 3, categoryTT32: 'II', detail: `Huyết áp bình thường (${s}/${d} mmHg), nhịp tim bất thường ${p} ck/phút` }
  }
  return { scoreTT105: 1, categoryTT32: 'I', detail: `Huyết áp ${s}/${d} mmHg, nhịp tim ${p} ck/phút (Rất tốt - Điểm 1)` }
}

export function evaluateDental(input: AssessmentInput): {
  scoreTT105: 1 | 2 | 3 | 4 | 5 | 6
  categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
  detail: string
} {
  const cav = input.cavitiesCount || 0
  const lost = input.lostTeethCount || 0

  if (lost >= 4 || cav >= 6) {
    return { scoreTT105: 4, categoryTT32: 'III', detail: `Mất ${lost} răng, ${cav} răng sâu chưa hàn (Điểm 4)` }
  }
  if (lost >= 2 || cav >= 3) {
    return { scoreTT105: 3, categoryTT32: 'II', detail: `Có ${cav} răng sâu, mất ${lost} răng (Điểm 3)` }
  }
  if (cav >= 1 || lost === 1) {
    return { scoreTT105: 2, categoryTT32: 'I', detail: `Có ${cav} răng sâu nhẹ hoặc mất 1 răng đã phục hình (Điểm 2)` }
  }
  return { scoreTT105: 1, categoryTT32: 'I', detail: 'Hàm răng tốt, không sâu, không mất răng (Điểm 1)' }
}

export function evaluateENT(input: AssessmentInput): {
  scoreTT105: 1 | 2 | 3 | 4 | 5 | 6
  categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
  detail: string
} {
  if (input.chronicENT === 'otitis_media') {
    return { scoreTT105: 5, categoryTT32: 'IV', detail: 'Viêm tai giữa mạn tính thủng màng nhĩ (Điểm 5)' }
  }
  if (input.chronicENT === 'sinusitis') {
    return { scoreTT105: 3, categoryTT32: 'II', detail: 'Viêm xoang mạn tính (Điểm 3)' }
  }
  if (input.chronicENT === 'allergic_rhinitis') {
    return { scoreTT105: 2, categoryTT32: 'I', detail: 'Viêm mũi dị ứng thể nhẹ (Điểm 2)' }
  }
  if (input.hearingLeft === 'whisper_under_3m' || input.hearingRight === 'whisper_under_3m') {
    return { scoreTT105: 4, categoryTT32: 'III', detail: 'Sức nghe giảm, nói thầm dưới 3m (Điểm 4)' }
  }
  return { scoreTT105: 1, categoryTT32: 'I', detail: 'Tai Mũi Họng bình thường, thính lực tốt (Điểm 1)' }
}

export function classifyHealth(input: AssessmentInput): AssessmentResult {
  const bmi = calculateBMI(input.height, input.weight)
  const bmiStatus = getBMIStatus(bmi)
  const physicalTT105 = evaluatePhysicalTT105(input.gender, input.height, input.weight, input.chest, bmi)
  const physicalTT32 = evaluatePhysicalTT32(bmi, input.height, input.weight)

  const eye = evaluateEye(input)
  const circ = evaluateCirculation(input)
  const dental = evaluateDental(input)
  const ent = evaluateENT(input)

  // Mapping departmental results
  const deptList: {
    key: DepartmentKey
    nameVi: string
    scoreTT105: number
    categoryTT32: 'I' | 'II' | 'III' | 'IV' | 'V'
    statusNote: string
    isDisqualifyingMilitary?: boolean
  }[] = [
    {
      key: 'TheLuc',
      nameVi: 'Thể lực (Chiều cao, Cân nặng, BMI)',
      scoreTT105: physicalTT105.score,
      categoryTT32: physicalTT32.category,
      statusNote: `${input.height}cm, ${input.weight}kg, BMI ${bmi} (${bmiStatus}). ${physicalTT105.detail}`
    },
    {
      key: 'Mat',
      nameVi: 'Mắt & Khúc xạ',
      scoreTT105: eye.scoreTT105,
      categoryTT32: eye.categoryTT32,
      statusNote: eye.detail,
      isDisqualifyingMilitary: eye.disqualifiesMilitaryAdmissions
    },
    {
      key: 'TMH',
      nameVi: 'Tai Mũi Họng & Thính lực',
      scoreTT105: ent.scoreTT105,
      categoryTT32: ent.categoryTT32,
      statusNote: ent.detail
    },
    {
      key: 'RHM',
      nameVi: 'Răng Hàm Mặt',
      scoreTT105: dental.scoreTT105,
      categoryTT32: dental.categoryTT32,
      statusNote: dental.detail
    },
    {
      key: 'Noi',
      nameVi: 'Nội khoa & Tuần hoàn',
      scoreTT105: circ.scoreTT105,
      categoryTT32: circ.categoryTT32,
      statusNote: circ.detail
    }
  ]

  // Add selected diseases from ICD-10 into corresponding departments
  const warnings: string[] = []
  const recommendations: string[] = []

  let maxTT105Score = Math.max(
    physicalTT105.score,
    eye.scoreTT105,
    ent.scoreTT105,
    dental.scoreTT105,
    circ.scoreTT105
  ) as 1 | 2 | 3 | 4 | 5 | 6

  // Evaluate selected ICD-10 items
  for (const disease of input.selectedDiseases) {
    if (disease.tt105Score > maxTT105Score) {
      maxTT105Score = disease.tt105Score
    }

    let existingDept = deptList.find((d) => d.key === disease.department)
    if (existingDept) {
      if (disease.tt105Score > existingDept.scoreTT105) {
        existingDept.scoreTT105 = disease.tt105Score
        existingDept.categoryTT32 = disease.tt32Category
      }
      existingDept.statusNote += `; Bệnh mắc kèm: [${disease.code}] ${disease.nameVi}`
    } else {
      deptList.push({
        key: disease.department,
        nameVi: `Chuyên khoa ${disease.department}`,
        scoreTT105: disease.tt105Score,
        categoryTT32: disease.tt32Category,
        statusNote: `[${disease.code}] ${disease.nameVi} - ${disease.tt105Detail}`
      })
    }

    if (disease.tt105Score >= 4) {
      warnings.push(`Phát hiện bệnh [${disease.code}] ${disease.nameVi} (Xếp Điểm ${disease.tt105Score} theo TT 105; Loại ${disease.tt32Category} theo TT 32)`)
    }
    if (disease.occupationalNote) {
      recommendations.push(`Khuyến nghị về ${disease.nameVi}: ${disease.occupationalNote}`)
    }
  }

  // Military admission checks
  let canJoinMilitaryAdmission = true
  let militaryAdmissionBranch: 'all' | 'technical_only' | 'none' = 'all'

  // Height / Weight standards for military admissions
  let minHeight = 165
  let minWeight = 50
  if (input.gender === 'female') {
    minHeight = 154
    minWeight = 48
  } else if (input.priorityGroup === 'kv1_island') {
    minHeight = 160
    minWeight = 48
  } else if (input.priorityGroup === 'minority_special') {
    minHeight = 158
    minWeight = 46
  }

  if (input.height < minHeight || input.weight < minWeight) {
    canJoinMilitaryAdmission = false
    warnings.push(`Chiều cao ${input.height}cm hoặc Cân nặng ${input.weight}kg chưa đạt chuẩn tối thiểu tuyển sinh quân sự (Yêu cầu >= ${minHeight}cm, >= ${minWeight}kg).`)
  }

  if (bmi < 18.5 || bmi >= 27.0) {
    warnings.push(`Chỉ số BMI ${bmi} nằm ngoài khoảng 18.5 - 26.9 theo quy chế tuyển sinh quân sự.`)
    if (bmi >= 30 || bmi < 17.5) {
      canJoinMilitaryAdmission = false
    }
  }

  if (eye.disqualifiesMilitaryAdmissions) {
    canJoinMilitaryAdmission = false
    militaryAdmissionBranch = 'none'
    warnings.push(`Tật khúc xạ hoặc thị lực (${eye.detail}) không đủ điều kiện tuyển sinh vào các học viện, trường Quân đội.`)
  } else if (eye.admissibleToTechnicalMilitaryOnly) {
    militaryAdmissionBranch = 'technical_only'
    warnings.push('Thí sinh bị cận thị nhẹ đến vừa (< 3.0D). Theo quy định, KHÔNG tuyển vào các trường Sĩ quan chỉ huy, chính trị; CHỈ ĐƯỢC XÉT TUYỂN vào các trường kỹ thuật (HV Kỹ thuật Quân sự, HV Quân y, Hệ Kỹ thuật PK-KQ, Hải quân) nếu thị lực chỉnh kính đạt 10/10.')
  }

  // TT105 Overall Score check
  if (maxTT105Score >= 3) {
    if (maxTT105Score >= 4) {
      canJoinMilitaryAdmission = false
      militaryAdmissionBranch = 'none'
    } else if (militaryAdmissionBranch === 'all' && maxTT105Score === 3) {
      // Loại 3 thường không đạt tiêu chuẩn tuyển sinh sĩ quan (chỉ tuyển loại 1, loại 2)
      militaryAdmissionBranch = 'technical_only'
    }
  }

  // TT32 Overall category mapping
  const categoryOrder = { I: 1, II: 2, III: 3, IV: 4, V: 5 }
  let worstCategoryVal = 1
  for (const dept of deptList) {
    const val = categoryOrder[dept.categoryTT32] || 1
    if (val > worstCategoryVal) {
      worstCategoryVal = val
    }
  }
  const reverseCat: ('I' | 'II' | 'III' | 'IV' | 'V')[] = ['I', 'II', 'III', 'IV', 'V']
  const overallCategoryTT32 = reverseCat[worstCategoryVal - 1]

  const workFitnessMap = {
    I: 'Đủ điều kiện làm việc cho mọi ngành nghề, kể cả công việc nặng nhọc, độc hại, nguy hiểm.',
    II: 'Đủ điều kiện làm việc trong môi trường bình thường và hầu hết các vị trí tuyển dụng.',
    III: 'Đủ điều kiện làm việc đối với các công việc nhẹ hoặc trung bình; cần tránh lao động gắng sức quá mức.',
    IV: 'Sức khỏe yếu, chỉ phù hợp công việc nhẹ nhàng hoặc bán thời gian; cần theo dõi điều trị y tế.',
    V: 'Không đủ điều kiện làm việc hiện tại, cần được điều trị y tế chuyên sâu và phục hồi chức năng.'
  }

  const tt105Labels: Record<number, string> = {
    1: 'Sức khỏe Loại 1 (Rất tốt - Đạt chuẩn xuất sắc mọi chuyên khoa)',
    2: 'Sức khỏe Loại 2 (Tốt - Đạt tiêu chuẩn phục vụ Quân đội và Tuyển sinh)',
    3: 'Sức khỏe Loại 3 (Khá - Đủ điều kiện phục vụ NVQS; hạn chế tuyển sinh QS)',
    4: 'Sức khỏe Loại 4 (Trung bình - Cần bố trí vị trí phù hợp, không tuyển sinh QS)',
    5: 'Sức khỏe Loại 5 (Kém - Miễn/hoãn gọi nhập ngũ, cần điều trị phục hồi)',
    6: 'Sức khỏe Loại 6 (Rất kém - Không đủ điều kiện sức khỏe phục vụ Quân đội)'
  }

  const tt32Labels: Record<string, string> = {
    I: 'Sức khỏe Loại I (Rất khỏe)',
    II: 'Sức khỏe Loại II (Khỏe)',
    III: 'Sức khỏe Loại III (Trung bình)',
    IV: 'Sức khỏe Loại IV (Yếu)',
    V: 'Sức khỏe Loại V (Rất yếu)'
  }

  return {
    target: input.target,
    bmi,
    bmiStatus,
    physicalScore: {
      score: physicalTT105.score,
      categoryBYT: physicalTT32.category,
      detail: physicalTT105.detail
    },
    departmentResults: deptList,
    overallTT105: {
      score: maxTT105Score,
      label: tt105Labels[maxTT105Score],
      canJoinMilitaryAdmission: canJoinMilitaryAdmission && maxTT105Score <= 2,
      militaryAdmissionBranch,
      summaryNotes: [
        `Phân loại theo chỉ tiêu có điểm số cao nhất: Điểm ${maxTT105Score} (Loại ${maxTT105Score})`,
        canJoinMilitaryAdmission && maxTT105Score <= 2
          ? 'Đủ tiêu chuẩn sức khỏe xét tuyển vào các Học viện, Nhà trường Sĩ quan Quân đội.'
          : militaryAdmissionBranch === 'technical_only'
          ? 'Đủ điều kiện xét tuyển một số trường đào tạo kỹ thuật chuyên ngành (HVKTQS, HVQY...) có tiêu chuẩn riêng.'
          : 'Không đủ điều kiện sức khỏe dự tuyển sinh quân sự.'
      ]
    },
    overallTT32: {
      category: overallCategoryTT32,
      label: tt32Labels[overallCategoryTT32],
      workFitness: workFitnessMap[overallCategoryTT32],
      summaryNotes: [
        `Kết luận phân loại sức khỏe: Loại ${overallCategoryTT32}`,
        workFitnessMap[overallCategoryTT32]
      ]
    },
    criticalWarnings: warnings,
    recommendations: recommendations
  }
}
