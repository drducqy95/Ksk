export interface LegalArticle {
  article: string
  title: string
  content: string
}

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
  articles: LegalArticle[]
}

export const CIRCULARS: CircularInfo[] = [
  {
    id: 'vbhn88-2025-bqp',
    code: 'Văn bản hợp nhất 88/VBHN-BQP',
    name: 'Văn bản hợp nhất Thông tư quy định tiêu chuẩn sức khỏe, khám sức khỏe cho các đối tượng thuộc phạm vi quản lý của Bộ Quốc phòng',
    issueDate: '18/11/2025',
    effectiveDate: '18/11/2025',
    authority: 'Bộ trưởng Bộ Quốc phòng',
    replaces: 'Hợp nhất Thông tư số 105/2023/TT-BQP (06/12/2023) và Thông tư số 106/2025/TT-BQP (30/09/2025)',
    scope: [
      'Khám sức khỏe thực hiện nghĩa vụ quân sự (sơ tuyển và khám tuyển)',
      'Khám sức khỏe tuyển sinh quân sự vào các học viện, trường Quân đội',
      'Khám sức khỏe định kỳ cho quân nhân tại ngũ (sĩ quan, QNCN, HSQ, binh sĩ)',
      'Quản lý, kiểm tra sức khỏe quân nhân dự bị',
      'Khám tuyển dụng quân nhân chuyên nghiệp, công nhân và viên chức quốc phòng'
    ],
    gradingSystem: 'Thang điểm từ 1 đến 6 cho 8 chỉ tiêu chuyên khoa. Xếp loại sức khỏe chung từ Loại 1 đến Loại 6 lấy theo chỉ tiêu có điểm số cao nhất.',
    articles: [
      {
        article: 'Điều 4',
        title: 'Tiêu chuẩn sức khỏe chung',
        content: `1. Tiêu chuẩn phân loại sức khỏe:
- Loại 1: Tất cả các chỉ tiêu đều đạt điểm 1 (Tình trạng sức khỏe rất tốt);
- Loại 2: Có ít nhất một chỉ tiêu bị điểm 2 (Tình trạng sức khỏe tốt);
- Loại 3: Có ít nhất một chỉ tiêu bị điểm 3 (Tình trạng sức khỏe khá);
- Loại 4: Có ít nhất một chỉ tiêu bị điểm 4 (Tình trạng sức khỏe trung bình);
- Loại 5: Có ít nhất một chỉ tiêu bị điểm 5 (Tình trạng sức khỏe kém);
- Loại 6: Có ít nhất một chỉ tiêu bị điểm 6 (Tình trạng sức khỏe rất kém).

2. Chỉ tiêu đạt điều kiện nhập ngũ và tuyển sinh quân sự:
- Tuyển chọn công dân có sức khỏe Loại 1, Loại 2, Loại 3;
- Không gọi nhập ngũ công dân nghiện ma túy, nhiễm HIV, mắc tật khúc xạ (loạn thị, cận thị từ 1.5 diop trở lên theo quy định từng khối).`
      },
      {
        article: 'Điều 5',
        title: 'Bảng tiêu chuẩn thể lực (Phụ lục 1)',
        content: `NAM GIỚI:
- Loại 1: Chiều cao ≥ 163cm, Cân nặng ≥ 51kg, Vòng ngực ≥ 81cm, BMI: 18.5 - 24.9
- Loại 2: Chiều cao 160 - 162cm, Cân nặng 47 - 50kg, Vòng ngực 78 - 80cm, BMI: 18.0 - 26.9
- Loại 3: Chiều cao 157 - 159cm, Cân nặng 43 - 46kg, Vòng ngực 75 - 77cm, BMI: 17.5 - 29.9
- Loại 4: Chiều cao 155 - 156cm, Cân nặng 41 - 42kg, Vòng ngực 73 - 74cm
- Loại 5: Chiều cao 153 - 154cm, Cân nặng 39 - 40kg, Vòng ngực 71 - 72cm
- Loại 6: Chiều cao ≤ 152cm, Cân nặng ≤ 38kg, Vòng ngực ≤ 70cm hoặc BMI ≥ 30

NỮ GIỚI:
- Loại 1: Chiều cao ≥ 154cm, Cân nặng ≥ 48kg, BMI: 18.5 - 24.9
- Loại 2: Chiều cao 152 - 153cm, Cân nặng 44 - 47kg, BMI: 18.0 - 26.9
- Loại 3: Chiều cao 150 - 151cm, Cân nặng 42 - 43kg, BMI: 17.5 - 29.9
- Loại 4: Chiều cao 148 - 149cm, Cân nặng 40 - 41kg
- Loại 5: Chiều cao 146 - 147cm, Cân nặng 38 - 39kg
- Loại 6: Chiều cao ≤ 145cm, Cân nặng ≤ 37kg hoặc BMI ≥ 30`
      },
      {
        article: 'Điều 7',
        title: 'Quy định riêng Tuyển sinh quân sự',
        content: `1. Tiêu chuẩn chung: Thí sinh đạt sức khỏe Loại 1 hoặc Loại 2 theo quy định tại VBHN 88/VBHN-BQP.
2. Thể lực:
- Nam: Chiều cao ≥ 1.65m, Cân nặng ≥ 50kg.
- Nữ: Chiều cao ≥ 1.54m, Cân nặng ≥ 48kg.
- Thí sinh có nơi thường trú từ 3 năm trở lên thuộc KV1, hải đảo, người dân tộc thiểu số: Nam cao ≥ 1.60m, nặng ≥ 48kg; Nữ cao ≥ 1.52m, nặng ≥ 46kg.
- Thí sinh thuộc 16 dân tộc rất ít người (<10.000 người): Nam cao ≥ 1.58m, nặng ≥ 46kg.
3. Thị lực & Cận thị:
- Các trường đào tạo Sĩ quan chỉ huy, chính trị: Tuyệt đối KHÔNG tuyển thí sinh mắc tật khúc xạ cận thị.
- Các trường Kỹ thuật (Học viện Kỹ thuật Quân sự, Học viện Quân y, Hệ Kỹ thuật Quân chủng PK-KQ, Hải quân...): Tuyển thí sinh mắc tật khúc xạ cận thị không quá 3.0 diop, thị lực sau khi chỉnh kính đạt 10/10, tổng thị lực 2 mắt ≥ 19/10.`
      },
      {
        article: 'Điều 8',
        title: 'Khám sức khỏe định kỳ quân nhân tại ngũ',
        content: `1. Quân nhân tại ngũ được tổ chức khám sức khỏe định kỳ tối thiểu 01 lần/năm theo kế hoạch của cấp trung đoàn và tương đương trở lên.
2. Nội dung khám định kỳ:
- Đánh giá thể lực, BMI, huyết áp, nhịp tim;
- Khám toàn diện 8 chuyên khoa: Thể lực, Mắt, Tai Mũi Họng, Răng Hàm Mặt, Nội khoa, Ngoại khoa, Da liễu, Tâm thần kinh;
- Khám cận lâm sàng: X-quang tim phổi thẳng, Siêu âm ổ bụng, Công thức máu, Sinh hóa máu (men gan, đường máu, mỡ máu, chức năng thận), Tổng phân tích nước tiểu, Điện tâm đồ ECG.
3. Phân loại và bố trí công tác:
- Loại 1, 2, 3: Phục vụ bình thường, huấn luyện sẵn sàng chiến đấu;
- Loại 4: Bố trí công việc nhẹ nhàng hơn, điều trị ngoại trú;
- Loại 5, 6: Chuyển tuyến bệnh viện quân đội điều trị chuyên sâu hoặc giám định y khoa giải quyết chế độ nghỉ hưu/chuyển ngành.`
      }
    ]
  },
  {
    id: 'tt32-2023-byt',
    code: 'Thông tư 32/2023/TT-BYT',
    name: 'Quy định chi tiết một số điều của Luật Khám bệnh, chữa bệnh (Thay thế Thông tư 14/2013/TT-BYT)',
    issueDate: '31/12/2023',
    effectiveDate: '01/01/2024',
    authority: 'Bộ trưởng Bộ Y tế',
    replaces: 'Thông tư số 14/2013/TT-BYT ngày 06/05/2013 của Bộ Y tế',
    scope: [
      'Khám sức khỏe cho người dự tuyển lao động (xin việc làm)',
      'Khám sức khỏe tuyển sinh đại học, cao đẳng, trung cấp chuyên nghiệp',
      'Khám sức khỏe định kỳ cho người lao động theo Luật An toàn, vệ sinh lao động',
      'Khám sức khỏe cho người đi học tập, làm việc tại nước ngoài'
    ],
    gradingSystem: 'Thang 5 loại: Loại I (Rất khỏe), Loại II (Khỏe), Loại III (Trung bình), Loại IV (Yếu), Loại V (Rất yếu).',
    articles: [
      {
        article: 'Điều 30',
        title: 'Nội dung và danh mục khám sức khỏe bắt buộc',
        content: `1. Khám thể lực: Đo chiều cao, cân nặng, chỉ số BMI, mạch đập, huyết áp.
2. Khám lâm sàng toàn diện:
- Nội khoa (Tim mạch, Hô hấp, Tiêu hóa, Thận - Tiết niệu, Cơ xương khớp, Thần kinh);
- Ngoại khoa & Da liễu;
- Mắt (Thị lực không kính, có kính, các bệnh của mắt);
- Tai - Mũi - Họng (Thính lực tiếng nói thầm, nội soi tai mũi họng);
- Răng - Hàm - Mặt (Tình trạng răng sâu, mất răng, khớp cắn);
- Sản phụ khoa (đối với nữ giới).
3. Khám cận lâm sàng bắt buộc:
- Chụp X-quang tim phổi thẳng;
- Xét nghiệm huyết học: Công thức máu toàn phần (Hồng cầu, Bạch cầu, Tiểu cầu, Hemoglobin);
- Xét nghiệm sinh hóa: Đường huyết (Glucose máu lúc đói), Ure, Creatinin, Men gan (AST, ALT);
- Xét nghiệm nước tiểu: Tổng phân tích nước tiểu 10 thông số.`
      },
      {
        article: 'Điều 32',
        title: 'Nguyên tắc phân loại sức khỏe 5 bậc của Bộ Y tế',
        content: `- Loại I (Rất khỏe): Thể lực tốt, không có bệnh tật hoặc chỉ mắc bệnh nhẹ không ảnh hưởng công việc. Đủ điều kiện làm việc trong môi trường nặng nhọc, độc hại và bình thường.
- Loại II (Khỏe): Thể lực khá, có thể mắc bệnh nhẹ đã điều trị ổn định. Đủ điều kiện làm việc trong môi trường bình thường và hầu hết các vị trí công tác.
- Loại III (Trung bình): Thể lực trung bình hoặc mắc bệnh mạn tính nhẹ được kiểm soát tốt. Phù hợp với công việc nhẹ nhàng, tránh gắng sức quá mức.
- Loại IV (Yếu): Thể lực kém hoặc mắc bệnh mạn tính tiến triển, suy giảm khả năng lao động. Cần được điều trị phục hồi và bố trí công việc phù hợp sức khỏe.
- Loại V (Rất yếu): Mắc bệnh nặng, hiểm nghèo hoặc thể lực suy kiệt. Không đủ điều kiện tuyển dụng hoặc phải tạm ngừng lao động để điều trị.`
      },
      {
        article: 'Điều 33',
        title: 'Thời hạn giá trị của Giấy khám sức khỏe',
        content: `1. Giấy khám sức khỏe có giá trị trong thời hạn 12 tháng kể từ ngày người có thẩm quyền ký kết luận.
2. Đối với khám sức khỏe cho người lao động Việt Nam đi làm việc ở nước ngoài theo hợp đồng thì thời hạn của Giấy khám sức khỏe theo quy định của quốc gia hoặc vùng lãnh thổ mà người lao động đến làm việc.`
      }
    ]
  },
  {
    id: 'tt28-2016-byt',
    code: 'Thông tư 28/2016/TT-BYT & TT 15/2016/TT-BYT',
    name: 'Hướng dẫn quản lý bệnh nghề nghiệp và danh mục 35 bệnh nghề nghiệp được bảo hiểm xã hội',
    issueDate: '30/06/2016',
    effectiveDate: '15/08/2016',
    authority: 'Bộ trưởng Bộ Y tế',
    replaces: 'Thông tư liên tịch số 08/1998/TTLT-BYT-BLĐTBXH',
    scope: [
      'Khám sức khỏe trước khi bố trí việc làm cho người lao động tiếp xúc yếu tố có hại',
      'Khám phát hiện bệnh nghề nghiệp định kỳ (6 tháng hoặc 1 năm/lần)',
      'Quản lý hồ sơ vệ sinh lao động và sức khỏe người lao động tại doanh nghiệp'
    ],
    gradingSystem: 'Xác định tỷ lệ tổn thương cơ thể do bệnh nghề nghiệp (% TTCT) phục vụ chế độ bảo hiểm xã hội.',
    articles: [
      {
        article: 'Điều 1',
        title: 'Danh mục các nhóm bệnh nghề nghiệp phổ biến',
        content: `1. Nhóm bệnh bụi phổi nghề nghiệp: Bụi phổi Silic, Amiăng, bông, than...
2. Nhóm bệnh nhiễm độc nghề nghiệp: Nhiễm độc chì, benzen, thủy ngân, thuốc trừ sâu, khí CO...
3. Nhóm bệnh nghề nghiệp do yếu tố vật lý: Bệnh điếc nghề nghiệp do tiếng ồn, bệnh rung chuyển nghề nghiệp, bệnh do phóng xạ...
4. Nhóm bệnh da nghề nghiệp: Viêm da tiếp xúc, bệnh sạm da nghề nghiệp, bệnh nốt dầu...
5. Nhóm bệnh nhiễm khuẩn nghề nghiệp: Lao nghề nghiệp, Viêm gan virus B/C nghề nghiệp, HIV do tai nạn rủi ro nghề nghiệp, COVID-19 nghề nghiệp.`
      },
      {
        article: 'Điều 2',
        title: 'Chế độ khám sức khỏe định kỳ cho người lao động',
        content: `- Người lao động làm công việc nặng nhọc, độc hại, nguy hiểm hoặc đặc biệt nặng nhọc, độc hại, nguy hiểm: Phải được khám sức khỏe định kỳ ít nhất 06 tháng một lần.
- Người lao động bình thường: Khám sức khỏe định kỳ ít nhất 01 năm một lần.
- Chi phí khám sức khỏe định kỳ và khám phát hiện bệnh nghề nghiệp do người sử dụng lao động chi trả.`
      }
    ]
  },
  {
    id: 'tt37-2021-bqp',
    code: 'Thông tư 37/2021/TT-BQP',
    name: 'Quy định về quản lý, chăm sóc và bảo vệ sức khỏe quân nhân trong Quân đội nhân dân Việt Nam',
    issueDate: '09/04/2021',
    effectiveDate: '26/05/2021',
    authority: 'Bộ trưởng Bộ Quốc phòng',
    replaces: 'Quy định quản lý sức khỏe quân nhân trước đây',
    scope: [
      'Phân cấp quản lý hồ sơ sức khỏe quân nhân',
      'Quy trình tổ chức khám sức khỏe định kỳ hàng năm trong đơn vị',
      'Phác đồ điều trị, an điều dưỡng và quản lý bệnh mạn tính cho quân nhân tại ngũ'
    ],
    gradingSystem: 'Kết hợp đánh giá phân loại sức khỏe 6 bậc theo quy chuẩn Bộ Quốc phòng và theo dõi diễn biến bệnh mạn tính.',
    articles: [
      {
        article: 'Điều 3',
        title: 'Phân cấp quản lý sức khỏe quân nhân',
        content: `1. Quân y cấp tiểu đoàn, trung đoàn và tương đương: Quản lý sức khỏe hạ sĩ quan, binh sĩ, sĩ quan cấp phân đội.
2. Quân y cấp sư đoàn và tương đương: Quản lý sức khỏe sĩ quan cấp tá, cán bộ chủ trì.
3. Bệnh viện quân đội tuyến cuối: Quản lý hồ sơ sức khỏe cán bộ cao cấp, cán bộ giữ chức vụ lãnh đạo chỉ huy chiến dịch, chiến lược.`
      },
      {
        article: 'Điều 5',
        title: 'Quy trình xử lý đối với quân nhân suy giảm sức khỏe',
        content: `- Quân nhân sau khám định kỳ xếp Loại 4: Quân y đơn vị lập sổ theo dõi bệnh nhân mạn tính, cấp phát thuốc và bố trí nghỉ ngơi, giảm tải huấn luyện.
- Quân nhân xếp Loại 5 hoặc Loại 6: Chuyển về bệnh xá, bệnh viện quân y để điều trị tích cực; nếu sau điều trị không phục hồi thì chuyển Hội đồng Giám định Y khoa Quân đội để xem xét giải quyết chế độ phục viên, xuất ngũ hoặc chuyển ngành.`
      }
    ]
  }
]

export const TARGET_DESCRIPTIONS: Record<string, { title: string; circular: string; desc: string; badge: string }> = {
  'tuyen-sinh-quan-su': {
    title: 'Tuyển sinh quân sự',
    circular: 'Văn bản hợp nhất 88/VBHN-BQP (18/11/2025) & Quy chế Ban TSQS BQP',
    desc: 'Xét tuyển vào các học viện, trường sĩ quan quân đội. Yêu cầu sức khỏe Loại 1 hoặc Loại 2; có tiêu chuẩn thị lực và thể lực đặc thù theo từng khối trường.',
    badge: 'Bộ Quốc phòng'
  },
  'dinh-ky-quan-nhan': {
    title: 'Khám sức khỏe định kỳ quân nhân',
    circular: 'Văn bản hợp nhất 88/VBHN-BQP (18/11/2025) & TT 37/2021/TT-BQP',
    desc: 'Đánh giá phân loại sức khỏe định kỳ hàng năm cho sĩ quan, quân nhân chuyên nghiệp, hạ sĩ quan, binh sĩ theo tiêu chuẩn VBHN 88/VBHN-BQP để duy trì sẵn sàng chiến đấu.',
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
    circular: 'Thông tư 32/2023/TT-BYT, TT 28/2016/TT-BYT & Luật An toàn VSLĐ',
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
