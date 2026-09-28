import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const workbook = XLSX.readFile('/tmp/icd10.xlsx');
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

console.log('Total raw rows:', rows.length);

// Extract chapter from code
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

const seenCodes = new Set();
const items = [];

for (let i = 4; i < rows.length; i++) {
  const row = rows[i];
  if (!row || !row[1] || typeof row[1] !== 'string') continue;

  const rawCode = row[1].trim().toUpperCase();
  const nameVi = row[2] ? String(row[2]).trim() : '';
  const group = row[3] ? String(row[3]).trim() : '';
  const isValid = row[12] ? String(row[12]).trim().toLowerCase() : 'có';

  if (!rawCode || seenCodes.has(rawCode) || !nameVi) continue;
  seenCodes.add(rawCode);

  const chapter = getChapter(rawCode);
  const department = getDepartment(rawCode);

  items.push({
    code: rawCode,
    nameVi,
    nameEn: group || nameVi,
    chapter,
    department,
    group
  });
}

console.log('Unique valid ICD-10 items extracted:', items.length);

// Count by chapter
const chapterCounts = {};
items.forEach(item => {
  const ch = item.chapter.split('.')[0];
  chapterCounts[ch] = (chapterCounts[ch] || 0) + 1;
});
console.log('Chapter distribution:', chapterCounts);
