/**
 * @file Register.jsx
 * @description Komponen React untuk halaman web utama Register.jsx.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import * as BiIcons from "react-icons/bi";

// Fungsi pembantu untuk render ikon dengan aman
const Icon = ({ name, className }) => {
  const IconComponent = BiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const [lihatConfirmPassword, setLihatConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isMatch = confirmPassword !== "" && password === confirmPassword;
  const isMismatch = confirmPassword !== "" && password !== confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, { username, password });
      Swal.fire({ icon: 'success', title: 'Registrasi Berhasil', confirmButtonColor: '#1883FF' });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Registrasi gagal', confirmButtonColor: '#121214' });
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6 font-sans">
      <div className="bg-pure-white p-12 rounded-[3.5rem] shadow-2xl w-full max-w-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-primary"></div>

        {/* Tombol Kembali */}
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-primary transition-all group font-black text-[10px] uppercase tracking-widest">
            <Icon name="BiArrowBack" className="text-lg group-hover:-translate-x-1 transition-transform" />
            <span>Beranda</span>
        </Link>
        <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-dark rounded-3xl flex items-center justify-center mb-6 shadow-xl p-5">
                <img src="/logo.svg" alt="PerpusKu Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl font-black text-center text-dark tracking-tighter uppercase">
                Daftar Akun
            </h2>
            <p className="text-gray-400 font-black text-[10px] mt-2 uppercase tracking-[0.3em]">Join the Library</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative group">
            <Icon name="BiUserPlus" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Username"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-pure-white transition-all text-dark font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative group">
            <Icon name="BiLockOpenAlt" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors" />
            <input
              type={lihatPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-pure-white transition-all text-dark font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setLihatPassword(!lihatPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors">
              <Icon name={lihatPassword ? "BiShow" : "BiHide"} className="text-2xl" />
            </button>
          </div>

          <div className="relative">
            <div className="relative group">
              <Icon name="BiCheckShield" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors" />
              <input
                type={lihatConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                className={`w-full pl-12 pr-14 py-4 bg-gray-50 border rounded-2xl outline-none focus:ring-4 transition-all text-dark font-bold ${
                  isMismatch ? "border-red-500 focus:ring-red-50" : isMatch ? "border-green-500 focus:ring-green-50" : "border-gray-100 focus:ring-primary/10"
                }`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setLihatConfirmPassword(!lihatConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors">
                <Icon name={lihatConfirmPassword ? "BiShow" : "BiHide"} className="text-2xl" />
              </button>
            </div>
            {isMismatch && <p className="text-[10px] font-black text-red-500 mt-1 ml-1 uppercase tracking-widest">Password tidak sesuai!</p>}
            {isMatch && <p className="text-[10px] font-black text-green-500 mt-1 ml-1 uppercase tracking-widest">Password cocok!</p>}
          </div>

          <div className="pt-4">
            <button
                type="submit"
                disabled={isMismatch}
                className={`w-full text-pure-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs ${
                    isMismatch ? "bg-gray-200 shadow-none cursor-not-allowed" : "bg-primary shadow-primary/20 hover:bg-dark hover:shadow-dark/20"
                }`}
            >
                Daftar Sekarang
            </button>
          </div>
        </form>

        <div className="mt-10 text-center border-t pt-8 border-gray-50">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Sudah ada akun?{" "}
            <Link to="/login" className="text-primary hover:underline font-black transition-all">
              Login Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
