/**
 * @file Layout.jsx
 * @description Komponen React yang dapat digunakan ulang (reusable UI).
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import React from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import * as BiIcons from "react-icons/bi";

// Ambil JQuery dari window (CDN)
const $ = window.$;

// Fungsi pembantu untuk render ikon dengan aman
const Icon = ({ name, className }) => {
  const IconComponent = BiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem("token");
  
  const user = React.useMemo(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (!savedUser || savedUser === "undefined") return {};
      return JSON.parse(savedUser);
    } catch (e) {
      return {};
    }
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Logout',
      text: 'Anda akan keluar dari sesi ini.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1883FF',
      cancelButtonColor: '#121214',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil Logout',
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    }
  };


  const navLinks = [
    { name: "Katalog Buku", path: "/dashboard", iconName: "BiBookContent" },
    { name: "Manajemen User", path: "/users", adminOnly: true, iconName: "BiPeople" },
  ];

  return (
    <div className="min-h-screen bg-pure-white flex flex-col font-sans text-dark">
      {/* Navbar Premium Hitam */}
      <nav className="bg-dark shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-12">
              <Link to="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-pure-white rounded-xl p-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-2xl font-black text-pure-white tracking-tighter uppercase">
                  {import.meta.env.VITE_APP_NAME.slice(0, -2)}<span className="text-primary">{import.meta.env.VITE_APP_NAME.slice(-2)}</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  if (link.adminOnly && user.role !== "admin") return null;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                        isActive
                          ? "bg-primary text-pure-white shadow-lg shadow-primary/30"
                          : "text-gray-400 hover:text-pure-white hover:bg-white/5"
                      }`}
                    >
                      <Icon name={link.iconName} className="text-lg" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {user.role || "User"}
                </span>
                <span className="text-sm font-black text-pure-white mt-1">
                  {user.username || "Guest"}
                </span>
              </div>
              
              <div className="h-10 w-px bg-white/10 mx-2 hidden sm:block"></div>
              
              <button
                onClick={handleLogout}
                className="bg-white/5 text-pure-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all border border-white/10 flex items-center gap-2 active:scale-95"
              >
                <Icon name="BiLogOut" className="text-lg" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8">
        <Outlet />
      </main>

      {/* Footer Premium */}
      <footer className="bg-dark py-12 mt-auto border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-8 bg-pure-white rounded-lg p-1.5">
                <img src="/logo.svg" alt="Logo" />
            </div>
            <span className="text-xl font-black text-pure-white uppercase">{import.meta.env.VITE_APP_NAME.slice(0, -2)}<span className="text-primary">{import.meta.env.VITE_APP_NAME.slice(-2)}</span></span>
          </div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-4">
            Sistem Perpustakaan Digital Tercanggih
          </p>
          <div className="h-px w-20 bg-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-[10px] font-medium">
            &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
