export interface MilitarySchool {
  code: string
  name: string
  category: 'command' | 'technical' | 'special'
  heightReqMale: string
  heightReqFemale?: string
  weightReqMale: string
  weightReqFemale?: string
  visionReq: string
  note: string
}

export const MILITARY_SCHOOLS: MilitarySchool[] = [
  {
    code: 'KQ',
    name: 'Học viện Kỹ thuật Quân sự',
    category: 'technical',
    heightReqMale: '>= 163cm (KV1: >= 160cm)',
    heightReqFemale: '>= 154cm (KV1: >= 152cm)',
    weightReqMale: '>= 50kg (KV1: >= 48kg)',
    weightReqFemale: '>= 48kg (KV1: >= 46kg)',
    visionReq: 'Tuyển thí sinh cận thị không quá 3.0 đi-ốp; thị lực sau chỉnh kính đạt 10/10, tổng 2 mắt >= 19/10.',
    note: 'Đào tạo kỹ sư quân sự phục vụ Quân đội và công nghiệp quốc phòng.'
  },
  {
    code: 'YQ',
    name: 'Học viện Quân y',
    category: 'technical',
    heightReqMale: '>= 163cm (KV1: >= 160cm)',
    heightReqFemale: '>= 154cm (KV1: >= 152cm)',
    weightReqMale: '>= 50kg (KV1: >= 48kg)',
    weightReqFemale: '>= 48kg (KV1: >= 46kg)',
    visionReq: 'Tuyển thí sinh mắc tật khúc xạ cận thị không quá 3.0D, chỉnh kính đạt 10/10.',
    note: 'Đào tạo Bác sĩ đa khoa quân y và Dược sĩ sĩ quan.'
  },
  {
    code: 'LQ1',
    name: 'Trường Sĩ quan Lục quân 1 (Đại học Trần Quốc Tuấn)',
    category: 'command',
    heightReqMale: '>= 165cm, Nặng >= 50kg',
    weightReqMale: '>= 50kg',
    visionReq: 'Tuyệt đối KHÔNG tuyển thí sinh cận thị hoặc có tật khúc xạ; thị lực không kính 10/10.',
    note: 'Đào tạo sĩ quan chỉ huy tham mưu binh chủng hợp thành phân đội.'
  },
  {
    code: 'LQ2',
    name: 'Trường Sĩ quan Lục quân 2 (Đại học Nguyễn Huệ)',
    category: 'command',
    heightReqMale: '>= 165cm (KV1: >= 160cm)',
    weightReqMale: '>= 50kg (KV1: >= 48kg)',
    visionReq: 'Không tuyển thí sinh mắc tật khúc xạ cận thị, viễn thị, loạn thị.',
    note: 'Đào tạo sĩ quan chỉ huy cho các đơn vị phía Nam.'
  },
  {
    code: 'CT',
    name: 'Trường Sĩ quan Chính trị (Đại học Chính trị)',
    category: 'command',
    heightReqMale: '>= 165cm (KV1: >= 160cm)',
    weightReqMale: '>= 50kg (KV1: >= 48kg)',
    visionReq: 'Không tuyển thí sinh cận thị.',
    note: 'Đào tạo cán bộ chính trị cấp phân đội trong Quân đội.'
  },
  {
    code: 'HQ',
    name: 'Học viện Hải quân',
    category: 'command',
    heightReqMale: '>= 165cm, Nặng >= 50kg',
    weightReqMale: '>= 50kg',
    visionReq: 'Thị lực tốt, không cận thị; riêng chuyên ngành Kỹ thuật Hải quân tuyển cận thị <= 3.0D.',
    note: 'Đào tạo sĩ quan chỉ huy tàu và kỹ thuật Hải quân.'
  },
  {
    code: 'PK',
    name: 'Học viện Phòng không - Không quân',
    category: 'special',
    heightReqMale: 'Phi công: >= 168cm, cân nặng >= 54kg. Sĩ quan chỉ huy: >= 165cm',
    weightReqMale: 'Phi công >= 54kg',
    visionReq: 'Phi công: Khám theo tiêu chuẩn Giám định Sức khỏe Phi công Quân sự (thị lực 10/10, kiểm tra buồng giảm áp).',
    note: 'Đào tạo sĩ quan phi công quân sự, chỉ huy radar, tên lửa, pháo phòng không.'
  },
  {
    code: 'HC',
    name: 'Học viện Hậu cần',
    category: 'command',
    heightReqMale: '>= 165cm, Nặng >= 50kg',
    heightReqFemale: '>= 154cm, Nặng >= 48kg',
    weightReqMale: '>= 50kg',
    weightReqFemale: '>= 48kg',
    visionReq: 'Chuyên ngành Chỉ huy: Không tuyển cận thị; Ngành Tài chính, Quân nhu cho phép cận <= 3.0D.',
    note: 'Đào tạo sĩ quan ngành tài chính quân đội, quân nhu, xăng dầu, vận tải.'
  }
]
