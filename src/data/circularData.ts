export interface CircularInfo {
  id: string
  code: string
  name: string
  issueDate: string
  effectiveDate: string
  authority: string
  replaces: string
  scope: string[]
  gradingSystem: string
  keyProvisions: {
    title: string
    content: string
  }[]
}

export const CIRCULARS: CircularInfo[] = [
  {
    id: 'tt105-2023-bqp',
    code: 'Thông tư 105/2023/TT-BQP',
    name: 'Quy định tiêu chuẩn sức khỏe, khám sức khỏe cho các đối tượng thuộc phạm vi quản lý của Bộ Quốc phòng',
    issueDate: '06/12/2023',
    effectiveDate: '01/01/2024',
    authority: 'Bộ trưởng Bộ Quốc phòng',
    replaces: 'Thông tư liên tịch số 16/2016/TTLT-BYT-BQP',
    scope: [
      'Khám sức khỏe thực hiện nghĩa vụ quân sự',
      'Tuyển sinh quân sự (đào tạo sĩ quan, hạ sĩ quan chỉ huy, chuyên môn kỹ thuật)',
      'Khám sức khỏe định kỳ cho quân nhân (sĩ quan, QNCN, hạ sĩ quan, binh sĩ)',
      'Tuyển dụng vào quân đội'
    ],
    gradingSystem: 'Thang điểm 1 - 6 cho từng chuyên khoa. Xếp loại sức khỏe chung từ Loại 1 đến Loại 6 (lấy theo chỉ tiêu có điểm số cao nhất).',
    keyProvisions: [
      {
        title: 'Chỉ tiêu phân loại sức khỏe chung',
        content: 'Loại 1: Tất cả các chỉ tiêu đạt điểm 1 (Rất tốt);\nLoại 2: Có ít nhất một chỉ tiêu bị điểm 2 (Tốt);\nLoại 3: Có ít nhất một chỉ tiêu bị điểm 3 (Khá);\nLoại 4: Có ít nhất một chỉ tiêu bị điểm 4 (Trung bình);\nLoại 5: Có ít nhất một chỉ tiêu bị điểm 5 (Kém);\nLoại 6: Có ít nhất một chỉ tiêu bị điểm 6 (Rất kém).'
      },
      {
        title: 'Tiêu chuẩn thể lực chung (Bảng 1 Phụ lục 1)',
        content: 'Nam:\n- Loại 1: Cao >= 163cm, Cân nặng >= 51kg, Vòng ngực >= 81cm, BMI 18.5 - 24.9\n- Loại 2: Cao 160 - 162cm, Cân nặng 47 - 50kg, Vòng ngực 78 - 80cm\n- Loại 3: Cao 157 - 159cm, Cân nặng 43 - 46kg, Vòng ngực 75 - 77cm\n- Dưới 157cm hoặc dưới 43kg: Điểm 4 - 6.\nNữ:\n- Loại 1: Cao >= 154cm, Cân nặng >= 48kg, BMI 18.5 - 24.9\n- Loại 2: Cao 152 - 153cm, Cân nặng 44 - 47kg\n- Loại 3: Cao 150 - 151cm, Cân nặng 42 - 43kg\n- Dưới 150cm hoặc dưới 42kg: Điểm 4 - 6.'
      },
      {
        title: 'Tiêu chuẩn riêng Tuyển sinh quân sự',
        content: '- Thể lực chung: Nam cao >= 1.65m, nặng >= 50kg; Nữ cao >= 1.54m, nặng >= 48kg.\n- Thí sinh KV1, hải đảo, dân tộc thiểu số: Nam cao >= 1.60m, nặng >= 48kg; Nữ cao >= 1.52m, nặng >= 46kg.\n- Dân tộc rất ít người (<10.000 người): Nam cao >= 1.58m, nặng >= 46kg.\n- Trường Sĩ quan chỉ huy, chính trị: Không tuyển thí sinh cận thị.\n- Trường Kỹ thuật (HVKTQS, HVQY, Hệ Kỹ thuật PK-KQ, Hải quân...): Tuyển thí sinh cận không quá 3.0D, thị lực sau chỉnh kính đạt 10/10, tổng thị lực 2 mắt >= 19/10.'
      }
    ]
  },
  {
    id: 'tt32-2023-byt',
    code: 'Thông tư 32/2023/TT-BYT',
    name: 'Quy định chi tiết một số điều của Luật Khám bệnh, chữa bệnh (thay thế TT 14/2013/TT-BYT)',
    issueDate: '31/12/2023',
    effectiveDate: '01/01/2024',
    authority: 'Bộ Y tế',
    replaces: 'Thông tư số 14/2013/TT-BYT ngày 06/05/2013 của Bộ Y tế',
    scope: [
      'Khám sức khỏe tuyển sinh vào các trường đại học, cao đẳng, trung cấp chuyên nghiệp',
      'Khám sức khỏe xin việc làm (tuyển dụng người lao động)',
      'Khám sức khỏe định kỳ cho người lao động tại các cơ quan, xí nghiệp, doanh nghiệp',
      'Khám sức khỏe cho người Việt Nam đi học tập, làm việc tại nước ngoài'
    ],
    gradingSystem: 'Phân loại theo 5 loại: Loại I (Rất khỏe), Loại II (Khỏe), Loại III (Trung bình), Loại IV (Yếu), Loại V (Rất yếu).',
    keyProvisions: [
      {
        title: 'Nguyên tắc xếp loại sức khỏe Bộ Y tế',
        content: '- Loại I: Thể lực rất tốt, không mắc bệnh lý hoặc chỉ có bất thường nhẹ không ảnh hưởng khả năng làm việc. Đủ điều kiện làm mọi công việc nặng nhọc, nguy hiểm.\n- Loại II: Thể lực tốt, có thể có bệnh nhẹ đã điều trị ổn định. Đủ điều kiện làm việc trong môi trường bình thường và hầu hết công việc chuyên môn.\n- Loại III: Thể lực trung bình hoặc mắc bệnh mạn tính nhẹ kiểm soát tốt. Phù hợp các công việc nhẹ, tránh lao động gắng sức quá mức.\n- Loại IV: Thể lực kém hoặc mắc bệnh mạn tính đang tiến triển, suy giảm chức năng vừa. Cần được điều trị và bố trí việc làm phù hợp.\n- Loại V: Thể lực rất kém hoặc mắc bệnh nặng, mất khả năng lao động. Không đủ điều kiện tuyển dụng hoặc phải tạm nghỉ để điều trị chuyên khoa.'
      },
      {
        title: 'Nội dung khám bắt buộc theo Thông tư 32',
        content: '1. Khám thể lực: Chiều cao, cân nặng, chỉ số BMI, huyết áp, nhịp tim.\n2. Khám lâm sàng: Nội khoa, Ngoại khoa, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Da liễu, Sản phụ khoa (đối với nữ).\n3. Cận lâm sàng bắt buộc:\n   - Chụp X-quang tim phổi thẳng\n   - Xét nghiệm huyết học: Công thức máu\n   - Xét nghiệm sinh hóa: Đường máu, Ure, Creatinin, Men gan (AST, ALT)\n   - Xét nghiệm nước tiểu: Tổng phân tích nước tiểu 10 thông số\n4. Các xét nghiệm chuyên sâu khác nếu đối tượng làm nghề độc hại, nặng nhọc.'
      }
    ]
  }
]

export const TARGET_DESCRIPTIONS: Record<string, { title: string; circular: string; desc: string; badge: string }> = {
  'tuyen-sinh-quan-su': {
    title: 'Tuyển sinh quân sự',
    circular: 'Thông tư 105/2023/TT-BQP & Quy chế Ban TSQS BQP',
    desc: 'Xét tuyển vào các học viện, trường sĩ quan quân đội. Yêu cầu sức khỏe Loại 1 hoặc Loại 2; có tiêu chuẩn thị lực và thể lực đặc thù theo từng khối trường.',
    badge: 'Bộ Quốc phòng'
  },
  'dinh-ky-quan-nhan': {
    title: 'Khám sức khỏe định kỳ quân nhân',
    circular: 'Thông tư 105/2023/TT-BQP',
    desc: 'Đánh giá phân loại sức khỏe hàng năm cho sĩ quan, quân nhân chuyên nghiệp, công nhân quốc phòng để duy trì sẵn sàng chiến đấu.',
    badge: 'Quân đội'
  },
  'xin-viec-lam': {
    title: 'Khám sức khỏe xin việc làm',
    circular: 'Thông tư 32/2023/TT-BYT',
    desc: 'Cấp giấy chứng nhận sức khỏe nộp hồ sơ xin việc, tuyển dụng tại doanh nghiệp, cơ quan nhà nước. Phân loại Loại I đến V.',
    badge: 'Bộ Y tế'
  },
  'dinh-ky-lao-dong': {
    title: 'Khám định kỳ người lao động',
    circular: 'Thông tư 32/2023/TT-BYT & Luật An toàn VSLĐ',
    desc: 'Khám sức khỏe định kỳ hàng năm cho cán bộ công nhân viên, phát hiện sớm bệnh lý nghề nghiệp và bố trí vị trí làm việc phù hợp.',
    badge: 'Lao động'
  },
  'tuyen-sinh-hoc-tap': {
    title: 'Khám tuyển sinh Đại học / Cao đẳng',
    circular: 'Thông tư 32/2023/TT-BYT',
    desc: 'Khám sức khỏe đầu khóa cho tân sinh viên nhập học các trường đại học, cao đẳng, trung cấp chuyên nghiệp dân sự.',
    badge: 'Học tập'
  }
}
