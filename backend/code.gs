
/**
 * BACKEND GOOGLE APPS SCRIPT (SPMB INTEGRATION)
 */

const SPREADSHEET_ID = '17_33_slf7dnusMRILQJT54vk5y_1Y126a23PsWa6SHc';
const FOLDER_ID_DRIVE = '1a1tTO1XqksEA0Udck95NV4yVTw8uNTKX'; 
const TEMPLATE_DOC_ID = '17ph6ZALiRqh8fXaNHLYQzHc8uo5mSITPcMDf_AP8Hns'; 

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

function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const action = requestData.action;
    const payload = requestData.payload;

    if (action === 'register') return handleRegistration(payload);
    if (action === 'list') return getRegistrations();

    return responseSuccess({ message: 'Action not found' });
  } catch (err) {
    return responseError(err.toString());
  }
}

function handleRegistration(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheets()[0];
  const folder = DriveApp.getFolderById(FOLDER_ID_DRIVE);
  
  const lastRow = sheet.getLastRow();
  const nextNumber = lastRow; 
  const regNo = "SPMB-2026-" + ("000" + nextNumber).slice(-4);
  
  const group = Math.floor((nextNumber - 1) / 200) + 1;
  const jadwal = getJadwalKonfigurasi(group);

  // Upload berkas (Wajib & Opsional)
  const docLinks = {};
  const allFiles = ['akta', 'kk', 'nisn', 'rapor', 'ijazahSMPMTsSederajat', 'kip', 'pkh', 'kks', 'bpjs'];
  allFiles.forEach(key => {
    if (data.dokumen[key] && data.dokumen[key].includes('base64,')) {
      docLinks[key] = uploadBase64File(data.dokumen[key], key.toUpperCase() + "-" + data.nama.toUpperCase(), folder);
    } else {
      docLinks[key] = "";
    }
  });

  // Generate PDF
  const pdfUrl = generatePdf(regNo, data, jadwal, folder);

  const rowData = [
    new Date(),
    regNo,
    data.nama,
    data.nik,
    data.nisn,
    data.telepon,
    data.tempatLahir,
    data.tanggalLahir,
    data.jenisKelamin,
    data.agama,
    data.asalSekolah,
    data.npsnSekolah,
    data.tahunLulus,
    data.pilihanJurusan1,
    data.pilihanJurusan2, // ✅ FIX koma

    data.alamat,
    data.desa,
    data.kecamatan,
    data.kabupatenKota,
    data.kodePos,
    data.statusKeluarga,
    data.anakKe,
    data.jumlahSaudara,
    data.nomorKK,

    // AYAH
    data.ayah.nama, 
    data.ayah.nik, 
    data.ayah.pendidikan, 
    data.ayah.pekerjaan, 
    data.ayah.penghasilan, 
    data.ayah.telepon,
    
    // IBU
    data.ibu.nama, 
    data.ibu.nik, 
    data.ibu.pendidikan, 
    data.ibu.pekerjaan, 
    data.ibu.penghasilan, 
    data.ibu.telepon,
    
    // WALI
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.nama : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.nik : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.pendidikan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.pekerjaan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.penghasilan : "-", 
    (data.wali && data.wali.status === 'Ada Wali') ? data.wali.telepon : "-",
    
    jadwal,
    pdfUrl,
    
    docLinks.akta,
    docLinks.kk,
    docLinks.nisn,
    docLinks.rapor,
    docLinks.ijazahSMPMTsSederajat,
    docLinks.kip,
    docLinks.pkh,
    docLinks.kks,
    docLinks.bpjs
  ];
  
  sheet.appendRow(rowData);

  return responseSuccess({
    nomorPendaftaran: regNo,
    jadwalSeleksi: jadwal,
    pdfUrl: pdfUrl
  });
}
