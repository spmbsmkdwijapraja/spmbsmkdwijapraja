
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormInput, FormSelect } from '../components/FormComponents';
import { api } from '../services/api';

const JURUSAN_OPTIONS = [
  'Desain Komunikasi Visual (DKV)',
  'Teknik Ketenagalistrikan (TKL)',
  'Teknik Pengelasan dan Fabrikasi Logam (TPFL)',
  'Teknik Otomotif (TO)',
];

const INFO_SOURCES = [
  'Media Sosial (Whatsapp, Facebook, Instagram, Twitter, Youtube dll)',
  'Radio',
  'Koran/Majalah',
  'Sosialisasi SMK Dwija Praja di SMP/MTs',
  'Teman/Saudara/Kerabat/Tetangga/Alumni SMK Dwija Praja',
  'Petugas SMK Dwija Praja yang datang ke rumah',
];

const PETUGAS_OPTIONS = [
  'HERBUDI MISTIANTO, S.Pd.',
  'SETYORINI, S.E.',
  'M. ZAENAL ARIFIN, S.T.',
  'I\'IN PARSIYANI, S.Pd.',
  'KASIH PUTRI P., S.Kom.',
];

const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Memulai pendaftaran...');
  const [petugasLain, setPetugasLain] = useState(false);

  const [formData, setFormData] = useState({
    // Data Siswa
    nama: '',
    jenisKelamin: '',
    agama: '',
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    desa: '',
    rT: '',
    rW: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    teleponSiswa: '',
    email: '',
    asalSekolah: '',
    tahunLulus: '',
    pilihanJurusan1: '',
    pilihanJurusan2: '',
    sumberInformasi: '',
    // Data Orang Tua
    namaOrtuWali: '',
    teleponOrtuWali: '',
    petugasPendaftaran: '',
    petugasLainnya: '',
  });

  const handleChange = (e: React.ChangeEvent<<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      alert('Nama Lengkap wajib diisi.');
      return;
    }
    if (!formData.jenisKelamin) {
      alert('Jenis Kelamin wajib dipilih.');
      return;
    }
    if (!formData.agama) {
      alert('Agama wajib dipilih.');
      return;
    }
    if (!formData.tempatLahir.trim()) {
      alert('Tempat Lahir wajib diisi.');
      return;
    }
    if (!formData.tanggalLahir.trim()) {
      alert('Tanggal Lahir wajib diisi.');
      return;
    }
    if (!formData.alamat.trim()) {
      alert('Alamat wajib diisi.');
      return;
    }
    if (!formData.desa.trim()) {
      alert('Desa/Kelurahan wajib diisi.');
      return;
    }
    if (!formData.rT.trim()) {
      alert('RT wajib diisi.');
      return;
    }
    if (!formData.rW.trim()) {
      alert('RW wajib diisi.');
      return;
    }
    if (!formData.kecamatan.trim()) {
      alert('Kecamatan wajib diisi.');
      return;
    }
    if (!formData.kabupatenKota.trim()) {
      alert('Kabupaten/Kota wajib diisi.');
      return;
    }
    if (!formData.provinsi.trim()) {
      alert('Provinsi wajib diisi.');
      return;
    }
    if (!formData.teleponSiswa.trim()) {
      alert('No. HP/WA Siswa wajib diisi.');
      return;
    }
    if (!formData.asalSekolah.trim()) {
      alert('Asal Sekolah wajib diisi.');
      return;
    }
    if (!formData.tahunLulus.trim()) {
      alert('Tahun Lulus wajib diisi.');
      return;
    }
    if (!formData.pilihanJurusan1) {
      alert('Pilihan Jurusan ke 1 wajib dipilih.');
      return;
    }
    if (!formData.pilihanJurusan2) {
      alert('Pilihan Jurusan ke 2 wajib dipilih.');
      return;
    }
    if (formData.pilihanJurusan1 === formData.pilihanJurusan2) {
      alert('Pilihan Jurusan ke 1 dan ke 2 tidak boleh sama.');
      return;
    }
    if (!formData.sumberInformasi) {
      alert('Sumber Informasi wajib dipilih.');
      return;
    }
    if (!formData.namaOrtuWali.trim()) {
      alert('Nama Orangtua/Wali Murid wajib diisi.');
      return;
    }
    if (!formData.teleponOrtuWali.trim()) {
      alert('No. HP/WA Orangtua/Wali Murid wajib diisi.');
      return;
    }

    setLoading(true);
    setLoadingStatus('Mengirim data pendaftaran...');
    setTimeout(() => setLoadingStatus('Menyusun bukti pendaftaran...'), 2000);

    try {
      const payload = {
        ...formData,
        petugasPendaftaran: petugasLain ? formData.petugasLainnya : formData.petugasPendaftaran,
      };

      const result = await api.submitRegistration(payload);
      if (result.success) {
        navigate('/success', { state: { data: result } });
      } else {
        alert('Gagal mengirim pendaftaran: ' + result.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Terjadi kesalahan koneksi ke server.');
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl animate-scaleIn">
            <div className="mb-8 relative">
              <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">Sedang Diproses</h3>
            <p className="text-slate-500 text-sm font-medium animate-pulse">{loadingStatus}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="bg-blue-600 px-8 py-10 text-white">
            <h2 className="text-2xl font-bold">Formulir Pendaftaran Online</h2>
            <p className="text-blue-100 mt-2">PPDB SMK Dwija Praja — Lengkapi seluruh data dengan benar.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">

            {/* ─── DATA SISWA ─── */}
            <section>
              <SectionTitle number="01" title="Data Calon Peserta Didik" />

              <div className="space-y-5">
                <FormInput
                  label="Nama Lengkap"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  helperText="Tulis dengan huruf besar/kapital"
                  style={{ textTransform: 'uppercase' }}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormSelect
                    label="Jenis Kelamin"
                    name="jenisKelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    options={['Laki-laki', 'Perempuan']}
                    required
                  />
                  <FormSelect
                    label="Agama"
                    name="agama"
                    value={formData.agama}
                    onChange={handleChange}
                    options={AGAMA_OPTIONS}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Tempat Lahir"
                    name="tempatLahir"
                    value={formData.tempatLahir}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Tanggal Lahir"
                    name="tanggalLahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    required
                  />
                </div>

                <FormInput
                  label="Alamat"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  required
                  type="textarea"
                  rows={2}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Desa/Kelurahan"
                    name="desa"
                    value={formData.desa}
                    onChange={handleChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="RT"
                      name="rT"
                      value={formData.rT}
                      onChange={handleChange}
                      required
                    />
                    <FormInput
                      label="RW"
                      name="rW"
                      value={formData.rW}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Kecamatan"
                    name="kecamatan"
                    value={formData.kecamatan}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Kabupaten/Kota"
                    name="kabupatenKota"
                    value={formData.kabupatenKota}
                    onChange={handleChange}
                    required
                    helperText="Contoh: Kota Pekalongan atau Kabupaten Pekalongan, Kabupaten Batang dll."
                  />
                </div>

                <FormInput
                  label="Provinsi"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="No. HP/WA Siswa"
                    name="teleponSiswa"
                    type="tel"
                    value={formData.teleponSiswa}
                    onChange={handleChange}
                    required
                    helperText="Usahakan belum pernah didaftarkan pada pendaftar lain. Jika sudah terdaftar, formulir hanya dikirim via email."
                  />
                  <FormInput
                    label="Alamat Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    helperText="Isi dengan email aktif yang masih ingat passwordnya"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="Asal Sekolah/SMP/MTs/Sederajat"
                    name="asalSekolah"
                    value={formData.asalSekolah}
                    onChange={handleChange}
                    required
                  />
                  <FormInput
                    label="Tahun Lulus"
                    name="tahunLulus"
                    type="number"
                    value={formData.tahunLulus}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </section>

            {/* ─── PILIHAN JURUSAN ─── */}
            <section>
              <SectionTitle number="02" title="Pilihan Jurusan / Kompetensi Keahlian" />
              <p className="text-sm text-slate-500 mb-4 -mt-2">Pilihlah jurusan yang sesuai minat dan bakat anda</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormSelect
                  label="Pilihan Jurusan ke 1"
                  name="pilihanJurusan1"
                  value={formData.pilihanJurusan1}
                  options={JURUSAN_OPTIONS}
                  required
                  onChange={e => {
                    if (e.target.value === formData.pilihanJurusan2) {
                      alert('Pilihan Jurusan ke 1 tidak boleh sama dengan ke 2');
                      return;
                    }
                    handleChange(e);
                  }}
                />
                <FormSelect
                  label="Pilihan Jurusan ke 2"
                  name="pilihanJurusan2"
                  value={formData.pilihanJurusan2}
                  options={JURUSAN_OPTIONS}
                  required
                  onChange={e => {
                    if (e.target.value === formData.pilihanJurusan1) {
                      alert('Pilihan Jurusan ke 2 tidak boleh sama dengan ke 1');
                      return;
                    }
                    handleChange(e);
                  }}
                />
              </div>
            </section>

            {/* ─── SUMBER INFORMASI ─── */}
            <section>
              <SectionTitle number="03" title="Informasi Pendaftaran" />
              <FormSelect
                label="Dari mana Anda mendapat Informasi tentang Pendaftaran Peserta Didik Baru SMK Dwija Praja"
                name="sumberInformasi"
                value={formData.sumberInformasi}
                options={INFO_SOURCES}
                required
                onChange={handleChange}
              />
            </section>

            {/* ─── DATA ORANG TUA ─── */}
            <section>
              <SectionTitle number="04" title="Data Orang Tua / Wali Murid" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  label="Nama Orangtua/Wali Murid"
                  name="namaOrtuWali"
                  value={formData.namaOrtuWali}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  label="No. HP/WA Orangtua/Wali Murid"
                  name="teleponOrtuWali"
                  type="tel"
                  value={formData.teleponOrtuWali}
                  onChange={handleChange}
                  required
                />
              </div>
            </section>

            {/* ─── PETUGAS PENDAFTARAN ─── */}
            <section>
              <SectionTitle number="05" title="Petugas Pendaftaran" />
              <p className="text-sm text-slate-500 mb-4 -mt-2">
                Kosongi jika calon peserta didik baru mengisi form tidak didampingi petugas pendaftaran atau mengisi form di rumah.
              </p>

              <div className="space-y-4">
                <FormSelect
                  label="Petugas Pendaftaran"
                  name="petugasPendaftaran"
                  value={formData.petugasPendaftaran}
                  options={['-- Tidak Didampingi Petugas --', ...PETUGAS_OPTIONS]}
                  onChange={e => {
                    if (e.target.value === 'Yang lain') {
                      setPetugasLain(true);
                      setFormData(prev => ({ ...prev, petugasPendaftaran: 'Yang lain' }));
                    } else {
                      setPetugasLain(false);
                      handleChange(e);
                    }
                  }}
                />

                {petugasLain && (
                  <FormInput
                    label="Nama Petugas Lainnya"
                    name="petugasLainnya"
                    value={formData.petugasLainnya}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama petugas lainnya"
                  />
                )}
              </div>
            </section>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-3 mx-auto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Selesaikan Pendaftaran
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center border-b border-slate-100 pb-3">
    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
      {number}
    </span>
    {title}
  </h3>
);

export default Register;
