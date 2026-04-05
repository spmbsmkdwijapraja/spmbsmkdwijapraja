
/**
 * BACKEND GOOGLE APPS SCRIPT (SPMB INTEGRATION)
 * Dengan CORS Handler Lengkap
 */

const SPREADSHEET_ID = '17_33_slf7dnusMRILQJT54vk5y_1Y126a23PsWa6SHc';
const FOLDER_ID_DRIVE = '1a1tTO1XqksEA0Udck95NV4yVTw8uNTKX'; 
const TEMPLATE_DOC_ID = '17ph6ZALiRqh8fXaNHLYQzHc8uo5mSITPcMDf_AP8Hns'; 

// ✅ FIX: CORS Headers untuk semua response
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// ✅ FIX: Fungsi WAJIB untuk handle preflight request
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(CORS_HEADERS);
}

// ✅ FIX: doGet untuk testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'alive',
    message: 'SPMB API is running'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeaders(CORS_HEADERS);
}

function doPost(e) {
  try {
    // ✅ FIX: Pastikan postData ada
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse(false, 'No data received', 400);
    }

    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const payload = requestData.payload;

    if (action === 'register') return handleRegistration(payload);
    if (action === 'list') return getRegistrations();

    return createResponse(false, 'Action not found', 400);
  } catch (err) {
    return createResponse(false, err.toString(), 500);
  }
}

// ✅ FIX: Helper function untuk response dengan CORS headers
function createResponse(success, dataOrMessage, statusCode = 200) {
  const output = success 
    ? { success: true, ...dataOrMessage }
    : { success: false, error: dataOrMessage };
    
  return ContentService.createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(CORS_HEADERS);
}

function getJadwalKonfigurasi(group) {
  const daftarJadwal = {
    "1": "Senin, 13 Juli 2026 - 08:00 WIB",
    "2": "Selasa, 14 Juli 2026 - 08:00 WIB",
    "3": "Rabu, 15 Juli 2026 - 08:00 WIB",
    "4": "Kamis, 16 Juli 2026 - 08:00 WIB",
    "5": "Jumat, 17 Juli 2026 - 08:00 WIB"
  };
  return daftarJadwal[group.toString()] || "Akan diumumkan melalui WhatsApp";
}

function handleRegistration(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];
    const folder = DriveApp.getFolderById(FOLDER_ID_DRIVE);
    
    const lastRow = sheet.getLastRow();
    const nextNumber = lastRow; 
    const regNo = "SPMB-2026-" + ("000" + nextNumber).slice(-4);
    
    const group = Math.floor((nextNumber - 1) / 200) + 1;
    const jadwal = getJadwalKonfigurasi(group);

    const docLinks = {};
    const allFiles = ['akta', 'kk', 'nisn', 'rapor', 'ijazahSMPSederajat', 'kip', 'pkh', 'kks', 'bpjs'];
    
    allFiles.forEach(key => {
      if (data.dokumen[key] && data.dokumen[key].includes('base64,')) {
        docLinks[key] = uploadBase64File(data.dokumen[key], key.toUpperCase() + "-" + data.nama.toUpperCase(), folder);
      } else {
        docLinks[key] = "";
      }
    });

    const pdfUrl = generatePdf(regNo, data, jadwal, folder);

    const rowData = [
      new Date(), regNo, data.nama, data.nik, data.nisn, data.telepon,
      data.tempatLahir, data.tanggalLahir, data.jenisKelamin, data.agama,
      data.asalSekolah, data.npsnSekolah, data.tahunLulus,
      data.pilihanJurusan1, data.pilihanJurusan2,
      data.alamat, data.desa, data.kecamatan, data.kabupatenKota, data.kodePos,
      data.statusKeluarga, data.anakKe, data.jumlahSaudara, data.nomorKK,
      data.ayah.nama, data.ayah.nik, data.ayah.pendidikan, data.ayah.pekerjaan, 
      data.ayah.penghasilan, data.ayah.telepon,
      data.ibu.nama, data.ibu.nik, data.ibu.pendidikan, data.ibu.pekerjaan, 
      data.ibu.penghasilan, data.ibu.telepon,
      data.wali.status === 'Ada Wali' ? data.wali.nama : "-", 
      data.wali.status === 'Ada Wali' ? data.wali.nik : "-", 
      data.wali.status === 'Ada Wali' ? data.wali.pendidikan : "-", 
      data.wali.status === 'Ada Wali' ? data.wali.pekerjaan : "-", 
      data.wali.status === 'Ada Wali' ? data.wali.penghasilan : "-", 
      data.wali.status === 'Ada Wali' ? data.wali.telepon : "-",
      jadwal, pdfUrl,
      docLinks.akta, docLinks.kk, docLinks.nisn, docLinks.rapor, 
      docLinks.ijazahSMPSederajat, docLinks.kip, docLinks.pkh, docLinks.kks, docLinks.bpjs
    ];
    
    sheet.appendRow(rowData);

    return createResponse(true, {
      nomorPendaftaran: regNo,
      jadwalSeleksi: jadwal,
      pdfUrl: pdfUrl
    });
  } catch (err) {
    return createResponse(false, 'Registration failed: ' + err.toString(), 500);
  }
}

function getRegistrations() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    const list = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      list.push({
        nomorPendaftaran: row[1],
        nama: row[2],
        nik: row[3],
        nisn: row[4],
        telepon: row[5],
        tempatLahir: row[6],
        tanggalLahir: row[7],
        jenisKelamin: row[8],
        agama: row[9],
        asalSekolah: row[10],
        npsnSekolah: row[11],
        tahunLulus: row[12],
        pilihanJurusan1: row[13],
        pilihanJurusan2: row[14],
        alamat: row[15],
        desa: row[16],
        kecamatan: row[17],
        kabupatenKota: row[18],
        kodePos: row[19],
        statusKeluarga: row[20],
        anakKe: row[21],
        jumlahSaudara: row[22],
        nomorKK: row[23],
        jadwalSeleksi: row[36],
        pdfUrl: row[37]
      });
    }
    
    return createResponse(true, { list: list });
  } catch (err) {
    return createResponse(false, 'Failed to get list: ' + err.toString(), 500);
  }
}

// Helper functions
function uploadBase64File(base64Data, fileName, folder) {
  try {
    const bytes = Utilities.base64Decode(base64Data.split(',')[1]);
    const blob = Utilities.newBlob(bytes, getContentType(base64Data), fileName);
    const file = folder.createFile(blob);
    return file.getUrl();
  } catch (err) {
    console.error('Upload error:', err);
    return "";
  }
}

function getContentType(base64Data) {
  if (base64Data.includes('data:image/jpeg')) return 'image/jpeg';
  if (base64Data.includes('data:image/png')) return 'image/png';
  if (base64Data.includes('data:application/pdf')) return 'application/pdf';
  return 'application/octet-stream';
}

function generatePdf(regNo, data, jadwal, folder) {
  try {
    const doc = DocumentApp.openById(TEMPLATE_DOC_ID);
    const copy = doc.makeCopy('Bukti Pendaftaran - ' + regNo, folder);
    const body = copy.getBody();
    
    body.replaceText('{{NOMOR_PENDAFTARAN}}', regNo);
    body.replaceText('{{NAMA}}', data.nama);
    body.replaceText('{{NIK}}', data.nik);
    body.replaceText('{{NISN}}', data.nisn);
    body.replaceText('{{JADWAL}}', jadwal);
    
    const pdfBlob = copy.getAs('application/pdf');
    const pdfFile = folder.createFile(pdfBlob).setName('Bukti_' + regNo + '.pdf');
    
    DriveApp.getFileById(copy.getId()).setTrashed(true);
    
    return pdfFile.getUrl();
  } catch (err) {
    console.error('PDF generation error:', err);
    return "";
  }
}
