
export interface StudentRegistration {
  id?: string;
  nomorPendaftaran?: string;
  
  // Data Siswa
  nama: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  desaKelurahan: string;
  rT: string;
  rW: string;
  kecamatan: string;
  kabupatenKota: string;
  provinsi: string;
  noHPWASiswa: string;
  alamatEmail: string;
  
  // Data Sekolah
  asalSekolahSMPMTsSederajat: string;
  tahunLulus: string;
  
  // Pilihan Jurusan
  pilihanJurusanke1: string;
  pilihanJurusanke2: string;
  
  // Informasi Tambahan
  sumberInformasi: string;
  
  // Data Orang Tua/Wali
  namaOrangtuaWaliMurid: string;
  noHPWAOrangtuaWaliMurid: string;
  
  // Petugas
  petugasPendaftaran: string;
  
  // Metadata
  createdAt?: string;
  pdfUrl?: string;
}
