
const SHEET_NAME = 'Pendaftaran';
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Ganti dengan ID Spreadsheet Anda

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getData') {
    return getAllData();
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    message: 'API is running'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.data && Array.isArray(data.data)) {
      appendToSheet(data.data);
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data saved successfully'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid data format'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function appendToSheet(rowData) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Header sesuai urutan kolom
    const headers = [
      'Timestamp',
      'No. Pendaftaran',
      'Nama Siswa',
      'Jenis Kelamin',
      'Agama',
      'Tempat Lahir',
      'Tanggal Lahir',
      'Alamat',
      'Desa/Kelurahan',
      'RT',
      'RW',
      'Kecamatan',
      'Kabupaten/Kota',
      'Provinsi',
      'No. HP/WA Siswa',
      'Alamat Email',
      'Asal Sekolah',
      'Tahun Lulus',
      'Pilihan Jurusan 1',
      'Pilihan Jurusan 2',
      'Sumber Informasi',
      'Nama Orang Tua/Wali',
      'No. HP/WA Orang Tua',
      'Petugas Pendaftaran'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  
  sheet.appendRow(rowData);
}

function getAllData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([]))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    const result = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
