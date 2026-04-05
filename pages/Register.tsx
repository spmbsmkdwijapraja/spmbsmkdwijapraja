
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  RELIGIONS, 
  JURUSAN, 
  SUMBER_INFORMASI, 
  PETUGAS_PENDAFTARAN,
  JENIS_KELAMIN,
  TAHUN_LULUS 
} from '../constants';
import { StudentRegistration } from '../types';
import { submitRegistration } from '../services/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<StudentRegistration>({
    nama: '',
    jenisKelamin: 'Laki-laki',
    agama: RELIGIONS[0],
    tempatLahir: '',
    tanggalLahir: '',
    alamat: '',
    desaKelurahan: '',
    rT: '',
    rW: '',
    kecamatan: '',
    kabupatenKota: '',
    provinsi: '',
    noHPWASiswa: '',
    alamatEmail: '',
    asalSekolahSMPMTsSederajat: '',
    tahunLulus: TAHUN_LULUS[0],
    pilihanJurusanke1: JURUSAN[0],
    pilihanJurusanke2: JURUSAN[1],
    sumberInformasi: SUMBER_INFORMASI[0],
    namaOrangtuaWaliMurid: '',
    noHPWAOrangtuaWaliMurid: '',
    petugasPendaftaran: PETUGAS_PENDAFTARAN[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateRegistrationNumber = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `PPDB${timestamp}${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const regNo = generateRegistrationNumber();
      const dataToSubmit = {
        ...formData,
        nomorPendaftaran: regNo,
        createdAt: new Date().toISOString()
      };
      
      await submitRegistration(dataToSubmit);
      navigate('/success', { state: { registrationNumber: regNo } });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, name, type = "text", required = true, ...props }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        {...props}
      />
    </div>
  );

  const SelectField = ({ label, name, options, required = true }: any) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        required={required}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Formulir Pendaftaran Siswa Baru</h1>
          <p className="text-blue-100 mt-1">Isi data dengan lengkap dan benar</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
            {['Data Pribadi', 'Data Alamat', 'Data Sekolah', 'Data Orang Tua'].map((step, idx) => (
              <div key={step} className={`flex items-center ${idx + 1 === currentStep ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${idx + 1 === currentStep ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                  {idx + 1}
                </div>
                <span className="hidden sm:inline text-sm">{step}</span>
              </div>
            ))}
          </div>

          {/* Step 1: Data Pribadi */}
          {currentStep === 1 && (
            <div className="animate-fadeIn space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Data Pribadi Siswa</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Nama Lengkap" name="nama" />
                <SelectField label="Jenis Kelamin" name="jenisKelamin" options={JENIS_KELAMIN} />
                <SelectField label="Agama" name="agama" options={RELIGIONS} />
                <InputField label="Tempat Lahir" name="tempatLahir" />
                <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" />
                <InputField label="No. HP/WA Siswa" name="noHPWASiswa" type="tel" />
                <InputField label="Alamat Email" name="alamatEmail" type="email" required={false} />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Data Alamat */}
          {currentStep === 2 && (
            <div className="animate-fadeIn space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Data Alamat</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <InputField label="Alamat Jalan" name="alamat" />
                </div>
                <InputField label="Desa/Kelurahan" name="desaKelurahan" />
                <InputField label="RT" name="rT" />
                <InputField label="RW" name="rW" />
                <InputField label="Kecamatan" name="kecamatan" />
                <InputField label="Kabupaten/Kota" name="kabupatenKota" />
                <InputField label="Provinsi" name="provinsi" />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Data Sekolah & Jurusan */}
          {currentStep === 3 && (
            <div className="animate-fadeIn space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Data Sekolah & Pilihan Jurusan</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Asal Sekolah (SMP/MTs/Sederajat)" name="asalSekolahSMPMTsSederajat" />
                <SelectField label="Tahun Lulus" name="tahunLulus" options={TAHUN_LULUS} />
                <SelectField label="Pilihan Jurusan 1" name="pilihanJurusanke1" options={JURUSAN} />
                <SelectField label="Pilihan Jurusan 2" name="pilihanJurusanke2" options={JURUSAN} />
                <SelectField label="Sumber Informasi" name="sumberInformasi" options={SUMBER_INFORMASI} />
                <SelectField label="Petugas Pendaftaran" name="petugasPendaftaran" options={PETUGAS_PENDAFTARAN} />
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Data Orang Tua */}
          {currentStep === 4 && (
            <div className="animate-fadeIn space-y-4">
              <h2 className="text-xl font-bold text-slate-800 mb-4 border-l-4 border-blue-600 pl-3">Data Orang Tua/Wali Murid</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <InputField label="Nama Orang Tua/Wali Murid" name="namaOrangtuaWaliMurid" />
                <InputField label="No. HP/WA Orang Tua/Wali Murid" name="noHPWAOrangtuaWaliMurid" type="tel" />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                <p className="text-sm text-yellow-800">
                  <strong>Perhatian:</strong> Pastikan semua data yang diisi sudah benar. 
                  Data yang sudah disubmit tidak dapat diubah.
                </p>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Kembali
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    'Submit Pendaftaran'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
