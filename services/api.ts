
import { StudentRegistration } from '../types';

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwGnej9wVNeKr3JtI2rQfLG3KkE__7-6Yas1FkKOWIZYZlHrDaD_y9UwD8xPZ9YVkBh/exec';

export const api = {
  submitRegistration: async (data: StudentRegistration) => {
    if (GAS_URL.includes('AKfycbzECTRz9Fh')) {
      console.warn("Peringatan: Anda masih menggunakan URL API dummy.");
    }

    try {
      // ✅ FIX: Gunakan text/plain untuk menghindari preflight CORS
      const response = await fetch(GAS_URL, {
        method: 'POST',
        // Hapus mode: 'cors' atau gunakan 'no-cors' jika masih error
        // mode: 'no-cors', // Uncomment jika CORS masih bermasalah (tapi response jadi opaque)
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // ✅ FIX: Hindari application/json
        },
        body: JSON.stringify({ action: 'register', payload: data })
      });
      
      // Jika menggunakan mode: 'no-cors', response tidak bisa di-parse sebagai JSON
      // karena menjadi opaque. Gunakan mode default (cors) jika doOptions() sudah benar.
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Gagal terhubung ke server. Periksa koneksi internet atau coba lagi nanti.');
    }
  },

  getAllRegistrations: async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // ✅ FIX
        },
        body: JSON.stringify({ action: 'list' })
      });
      const result = await response.json();
      return result.list || [];
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  }
};
