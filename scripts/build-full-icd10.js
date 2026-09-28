import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const workbook = XLSX.readFile('/tmp/icd10.xlsx');
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

console.log('Reading from Excel...');

function getChapter(code) {
  if (!code) return 'Khác';
  const prefix = code.charAt(0).toUpperCase();
  const num = parseInt(code.substring(1, 3), 10);

  if (prefix === 'A' || prefix === 'B') return 'I. Bệnh nhiễm trùng và ký sinh trùng (A00-B99)';
  if (prefix === 'C' || (prefix === 'D' && num <= 48)) return 'II. Khối u tân sinh (C00-D48)';
  if (prefix === 'D' && num >= 50) return 'III. Bệnh máu và cơ quan tạo máu (D50-D89)';
  if (prefix === 'E') return 'IV. Bệnh nội tiết, dinh dưỡng và chuyển hóa (E00-E90)';
  if (prefix === 'F') return 'V. Rối loạn tâm thần và hành vi (F00-F99)';
  if (prefix === 'G') return 'VI. Bệnh hệ thần kinh (G00-G99)';
  if (prefix === 'H' && num <= 59) return 'VII. Bệnh mắt và phần phụ (H00-H59)';
  if (prefix === 'H' && num >= 60) return 'VIII. Bệnh tai và xương chũm (H60-H95)';
  if (prefix === 'I') return 'IX. Bệnh hệ tuần hoàn (I00-I99)';
  if (prefix === 'J') return 'X. Bệnh hệ hô hấp (J00-J99)';
  if (prefix === 'K') return 'XI. Bệnh hệ tiêu hóa (K00-K93)';
  if (prefix === 'L') return 'XII. Bệnh da và mô dưới da (L00-L99)';
  if (prefix === 'M') return 'XIII. Bệnh hệ cơ xương khớp và mô liên kết (M00-M99)';
  if (prefix === 'N') return 'XIV. Bệnh hệ sinh dục - tiết niệu (N00-N99)';
  if (prefix === 'O') return 'XV. Mang thai, sinh đẻ và hậu sản (O00-O99)';
  if (prefix === 'P') return 'XVI. Một số tình trạng chu sinh (P00-P96)';
  if (prefix === 'Q') return 'XVII. Dị tật bẩm sinh, biến dạng (Q00-Q99)';
  if (prefix === 'R') return 'XVIII. Triệu chứng, dấu hiệu bất thường (R00-R99)';
  if (prefix === 'S' || prefix === 'T') return 'XIX. Vết thương, ngộ độc (S00-T98)';
  if (prefix === 'V' || prefix === 'W' || prefix === 'X' || prefix === 'Y') return 'XX. Nguyên nhân bên ngoài (V01-Y98)';
  if (prefix === 'Z') return 'XXI. Yếu tố ảnh hưởng sức khỏe (Z00-Z99)';
  if (prefix === 'U') return 'XXII. Mã dùng cho mục đích đặc biệt (U00-U85)';
  return 'Khác';
}

function getDepartment(code) {
  if (!code) return 'Noi';
  const prefix = code.charAt(0).toUpperCase();
  const num = parseInt(code.substring(1, 3), 10);

  if (prefix === 'H' && num <= 59) return 'Mat';
  if (prefix === 'H' && num >= 60) return 'TMH';
  if (prefix === 'J' && (num <= 6 || num === 30 || num === 31 || num === 32 || num === 34 || num === 35 || num === 36 || num === 37 || num === 38 || num === 39)) return 'TMH';
  if (prefix === 'K' && num <= 14) return 'RHM';
  if (prefix === 'L') return 'DaLieu';
  if (prefix === 'F' || prefix === 'G') return 'TamThanKinh';
  if (prefix === 'O' || (prefix === 'N' && num >= 70 && num <= 98)) return 'PhuSan';
  if (prefix === 'M' || prefix === 'S' || prefix === 'T' || (prefix === 'K' && (num === 40 || num === 41 || num === 42 || num === 43 || num === 60 || num === 61 || num === 62 || num === 64))) return 'Ngoai';
  return 'Noi';
}

function classifyDefault(code, nameVi) {
  const prefix = code.charAt(0).toUpperCase();
  const num = parseInt(code.substring(1, 3), 10);
  const lowerName = nameVi.toLowerCase();

  // U ác tính / ung thư
  if (prefix === 'C' || (prefix === 'D' && num >= 37 && num <= 48)) {
    return {
      tt105Score: 6,
      tt105Detail: 'U ác tính / tân sinh không rõ tính chất: Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Chống chỉ định tuyển sinh quân sự và nghĩa vụ quân sự.',
      tt32Category: 'V',
      tt32Detail: 'Loại V (mất sức lao động, cần điều trị tích cực).'
    };
  }

  // Bệnh nhiễm trùng nặng (HIV, Lao tiến triển...)
  if (code.startsWith('B20') || code.startsWith('B21') || code.startsWith('B22') || code.startsWith('B23') || code.startsWith('B24') || code.startsWith('A15') || code.startsWith('A16')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Bệnh truyền nhiễm nguy hiểm (Lao / HIV): Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Không đủ điều kiện tuyển sinh và nhập ngũ.',
      tt32Category: 'V',
      tt32Detail: 'Loại V (tạm hoãn làm việc để điều trị).'
    };
  }

  // Bệnh tim mạch nặng (suy tim, bệnh van tim, nhồi máu cơ tim...)
  if (code.startsWith('I50') || code.startsWith('I21') || code.startsWith('I22') || code.startsWith('I05') || code.startsWith('I06') || code.startsWith('I07') || code.startsWith('I08') || code.startsWith('I25')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Bệnh lý tim thực thể / suy tim / bệnh mạch vành: Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Chống chỉ định phục vụ Quân đội.',
      tt32Category: 'V',
      tt32Detail: 'Loại V (không đủ sức khỏe làm việc thông thường).'
    };
  }

  // Tâm thần nặng (F20, F22, F31...)
  if (code.startsWith('F20') || code.startsWith('F21') || code.startsWith('F22') || code.startsWith('F23') || code.startsWith('F25') || code.startsWith('F31') || code.startsWith('F00') || code.startsWith('F01') || code.startsWith('F02') || code.startsWith('F03')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Rối loạn tâm thần nặng / loạn thần: Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Chống chỉ định tuyệt đối.',
      tt32Category: 'V',
      tt32Detail: 'Mất khả năng lao động hoàn toàn.'
    };
  }

  // Động kinh (G40)
  if (code.startsWith('G40')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Bệnh động kinh: Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Tuyệt đối không tuyển sinh quân sự.',
      tt32Category: 'V',
      tt32Detail: 'Loại V. Không bố trí làm việc trên cao, dưới nước, lái xe.'
    };
  }

  // Suy thận mạn (N18)
  if (code.startsWith('N18')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Bệnh thận mạn: Điểm 5-6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Chống chỉ định tuyển sinh quân sự.',
      tt32Category: 'V',
      tt32Detail: 'Loại V.'
    };
  }

  // Bệnh mạn tính vừa (Đái tháo đường, Tăng huyết áp, Hen phế quản, COPD...)
  if (code.startsWith('E10') || code.startsWith('E11') || code.startsWith('E12') || code.startsWith('E13') || code.startsWith('E14') || code.startsWith('I10') || code.startsWith('I11') || code.startsWith('I12') || code.startsWith('I13') || code.startsWith('I15') || code.startsWith('J44') || code.startsWith('J45')) {
    return {
      tt105Score: 4,
      tt105Detail: 'Bệnh mạn tính nội khoa (THA, ĐTĐ, Hen, COPD): Điểm 4-6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Không đủ điều kiện tuyển sinh quân sự.',
      tt32Category: 'III',
      tt32Detail: 'Loại III hoặc IV tùy mức độ kiểm soát bệnh.'
    };
  }

  // Mắt giảm thị lực nặng / Mù
  if (code.startsWith('H54') || code.startsWith('H53.5')) {
    return {
      tt105Score: 6,
      tt105Detail: 'Khiếm thị / Mù màu / Suy giảm thị lực nặng: Điểm 6 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'ineligible',
      militaryAdmissionNote: 'Chống chỉ định tuyển sinh quân sự.',
      tt32Category: 'IV',
      tt32Detail: 'Loại IV hoặc V.'
    };
  }

  // Tình trạng kiểm tra / khám sức khỏe bình thường (Z00, Z01, Z02...)
  if (code.startsWith('Z00') || code.startsWith('Z01') || code.startsWith('Z02')) {
    return {
      tt105Score: 1,
      tt105Detail: 'Khám sức khỏe bình thường: Điểm 1 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'eligible',
      militaryAdmissionNote: 'Đạt điều kiện tuyển sinh quân sự.',
      tt32Category: 'I',
      tt32Detail: 'Loại I (Rất khỏe).'
    };
  }

  // Bệnh lý cấp tính nhẹ hoặc ngoài da thông thường
  if (prefix === 'K' && (num <= 3 || num === 5)) {
    return {
      tt105Score: 2,
      tt105Detail: 'Bệnh răng miệng nhẹ (sâu răng, viêm lợi): Điểm 1-2 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'eligible',
      militaryAdmissionNote: 'Đủ điều kiện; cần hàn răng trước khi nhập ngũ.',
      tt32Category: 'I',
      tt32Detail: 'Loại I hoặc II.'
    };
  }

  if (prefix === 'L' && (lowerName.includes('trứng cá') || lowerName.includes('viêm da') || lowerName.includes('mề đay'))) {
    return {
      tt105Score: 2,
      tt105Detail: 'Bệnh da liễu nhẹ: Điểm 2-3 (Theo VBHN 88/VBHN-BQP)',
      militaryAdmissionStatus: 'eligible',
      militaryAdmissionNote: 'Đạt điều kiện nếu thể nhẹ.',
      tt32Category: 'I',
      tt32Detail: 'Loại I hoặc II.'
    };
  }

  // Mặc định phân loại chung
  return {
    tt105Score: 3,
    tt105Detail: `Tình trạng bệnh lý [${code}]: Xếp Điểm 2-4 tùy mức độ (Theo VBHN 88/VBHN-BQP)`,
    militaryAdmissionStatus: 'conditional',
    militaryAdmissionNote: 'Cần bác sĩ chuyên khoa khám xác định mức độ cụ thể.',
    tt32Category: 'II',
    tt32Detail: 'Loại II hoặc III tùy mức độ ảnh hưởng đến khả năng làm việc.'
  };
}

const seenCodes = new Set();
const fullList = [];

for (let i = 4; i < rows.length; i++) {
  const row = rows[i];
  if (!row || !row[1] || typeof row[1] !== 'string') continue;

  const rawCode = row[1].trim().toUpperCase();
  const nameVi = row[2] ? String(row[2]).trim() : '';
  const group = row[3] ? String(row[3]).trim() : '';

  if (!rawCode || seenCodes.has(rawCode) || !nameVi) continue;
  seenCodes.add(rawCode);

  const chapter = getChapter(rawCode);
  const department = getDepartment(rawCode);
  const classification = classifyDefault(rawCode, nameVi);

  fullList.push({
    code: rawCode,
    nameVi,
    nameEn: group || nameVi,
    chapter,
    department,
    tt105Score: classification.tt105Score,
    tt105Detail: classification.tt105Detail,
    militaryAdmissionStatus: classification.militaryAdmissionStatus,
    militaryAdmissionNote: classification.militaryAdmissionNote,
    tt32Category: classification.tt32Category,
    tt32Detail: classification.tt32Detail
  });
}

console.log(`Generated ${fullList.length} items.`);

// Output to JSON file in public/data/icd10_full.json
const outputDir = path.resolve('public/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const jsonPath = path.join(outputDir, 'icd10_full.json');
fs.writeFileSync(jsonPath, JSON.stringify(fullList));
const stats = fs.statSync(jsonPath);
console.log(`Saved to ${jsonPath} (Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
