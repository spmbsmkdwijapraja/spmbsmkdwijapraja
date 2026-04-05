
export interface ParentData {
  nama: string;
  nik: string;
  pendidikan: string;
  pekerjaan: string;
  penghasilan: string;
  telepon: string;
}

export interface StudentRegistration {
  id?: string;
  nomorPendaftaran?: string;
  nama: string;
  nik: string;
  nisn: string;
  telepon: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  asalSekolah: string;
  npsnSekolah: string;
  tahunLulus: string;
  pilihanJurusan1: string;
  pilihanJurusan2: string;
  alamat: string;
  desa: string;
  rT: string;
  rW: string;
  kecamatan: string;
  kabupatenKota: string;
  kodePos: string;
  statusKeluarga: string;
  anakKe: string;
  jumlahSaudara: string;
  nomorKK: string;

  ayah: ParentData;
  ibu: ParentData;
  // ✅ FIX: Wali tidak optional, tapi status yang menentukan ada/tidak
  wali: ParentData & { status: 'Ada Wali' | 'Tidak Ada Wali' };

  dokumen: {
    akta: string;
    kk: string;
    nisn: string;
    rapor: string;
    // ✅ FIX: Key konsisten dengan backend GAS
    ijazahSMPSederajat?: string;
    kip?: string;
    pkh?: string;
    kks?: string;
    bpjs?: string;
  };

  jadwalSeleksi?: string;
  pdfUrl?: string;
  createdAt?: string;
}

export interface ScheduleSetting {
  id: string;
  groupNumber: number;
  date: string;
  location: string;
}
