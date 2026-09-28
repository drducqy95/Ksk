import XLSX from 'xlsx';

const workbook = XLSX.readFile('/tmp/icd10.xlsx');
const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

for (let i = 4; i < 15; i++) {
  console.log(`Row ${i}:`, JSON.stringify(data[i]));
}
