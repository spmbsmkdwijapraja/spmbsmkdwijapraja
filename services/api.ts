
import { StudentRegistration } from '../types';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzdRs6HeDFo6WFtZauUISfXOW1l1E-XKjC4duyyvoqFxzjFM0E6L3cH6tAQ64-UY3I-/exec'; // Ganti dengan URL GAS Anda

export const submitRegistration = async (data: StudentRegistration): Promise<void> => {
  const payload = [
    new Date().toISOString(),           // 0: Timestamp
    data.nomorPendaftaran,              // 1: No. Pendaftaran
    data.nama,                          // 2: Nama Siswa
    data.jenisKelamin,                  // 3: Jenis Kelamin
    data.agama,                         // 4: Agama
    data.tempatLahir,                   // 5: Tempat Lahir
    data.tanggalLahir,                  // 6: Tanggal Lahir
    data.alamat,                        // 7: Alamat
    data.desaKelurahan,                 // 8: Desa Kelurahan
    data.rT,                            // 9: RT
    data.rW,                            // 10: RW
    data.kecamatan,                     // 11: Kecamatan
    data.kabupatenKota,                 // 12: Kabupaten/Kota
    data.provinsi,                      // 13: Provinsi
    data.noHPWASiswa,                   // 14: No. HP/WA Siswa 
    data.alamatEmail,                   // 15: Alamat Email
    data.asalSekolahSMPMTsSederajat,    // 16: Asal Sekolah (SMP/MTs/Sederajat)
    data.tahunLulus,                    // 17: Tahun Lulus
    data.pilihanJurusanke1,             // 18: Pilihan Jurusan 1
    data.pilihanJurusanke2,             // 19: Pilihan Jurusan 2
    data.sumberInformasi,               // 20: Sumber Informasi
    data.namaOrangtuaWaliMurid,         // 21: Nama Orang Tua/Wali Murid
    data.noHPWAOrangtuaWaliMurid,       // 22: No. HP/WA Orang Tua/Wali Murid
    data.petugasPendaftaran             // 23: Petugas Pendaftaran
  ];

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: payload })
    });

    // Karena mode no-cors, kita tidak bisa membaca response
    // Simulasikan delay untuk UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Data submitted successfully:', payload);
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    throw error;
  }
};

export const getRegistrations = async (): Promise<StudentRegistration[]> => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL + '?action=getData');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
