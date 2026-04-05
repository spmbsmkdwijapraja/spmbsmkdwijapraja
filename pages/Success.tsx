
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const regNo = location.state?.registrationNumber || 'N/A';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-scaleIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Pendaftaran Berhasil!</h1>
        <p className="text-slate-600 mb-6">Terima kasih telah mendaftar. Simpan nomor pendaftaran Anda.</p>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-600 font-semibold mb-1">Nomor Pendaftaran</p>
          <p className="text-2xl font-bold text-blue-800 tracking-wider">{regNo}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Cetak Bukti
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
