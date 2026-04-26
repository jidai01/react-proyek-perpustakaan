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

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lihatPassword, setLihatPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Masuk',
        confirmButtonColor: '#1883FF'
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err.response?.data?.message || 'Kredensial tidak valid',
        confirmButtonColor: '#121214'
      });
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
        <div className="flex flex-col items-center mb-12">
            <div className="w-24 h-24 bg-dark rounded-3xl flex items-center justify-center mb-6 shadow-xl p-5">
                <img src="/logo.svg" alt="PerpusKu Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-4xl font-black text-center text-dark tracking-tighter uppercase">
                {import.meta.env.VITE_APP_NAME.slice(0, -2)}<span className="text-primary">{import.meta.env.VITE_APP_NAME.slice(-2)}</span>
            </h2>
            <p className="text-gray-400 font-black text-[10px] mt-2 uppercase tracking-[0.3em]">Access Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative group">
            <Icon name="BiUser" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors" />
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
            <Icon name="BiLockAlt" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xl group-focus-within:text-primary transition-colors" />
            <input
              type={lihatPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:bg-pure-white transition-all text-dark font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              onClick={() => setLihatPassword(!lihatPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
            >
              <Icon name={lihatPassword ? "BiShow" : "BiHide"} className="text-2xl" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-pure-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-dark hover:shadow-dark/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs"
          >
            Masuk Sekarang
          </button>
        </form>

        <div className="mt-12 text-center border-t pt-8 border-gray-50">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
            Baru di sini?{" "}
            <Link to="/register" className="text-primary hover:underline font-black transition-all">
              Daftar Akun
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
