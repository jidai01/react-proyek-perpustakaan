/**
 * @file Landing.jsx
 * @description Komponen React untuk halaman web utama Landing.jsx.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as BiIcons from "react-icons/bi";

// Fungsi pembantu untuk render ikon dengan aman
const Icon = ({ name, className }) => {
  const IconComponent = BiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-pure-white font-sans text-dark overflow-x-hidden">
      {/* Background Shapes Global */}
      <div className="fixed top-0 left-0 w-full h-full -z-50 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px]"></div>
      </div>

      {/* Navbar Premium */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-pure-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dark rounded-xl p-2 flex items-center justify-center shadow-2xl">
              <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">
              {import.meta.env.VITE_APP_NAME.slice(0, -2)}<span className="text-primary">{import.meta.env.VITE_APP_NAME.slice(-2)}</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <Link to="/login" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-primary transition-all">Masuk</Link>
            <Link to="/register" className="bg-primary text-pure-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-dark transition-all shadow-xl shadow-primary/20 hover:shadow-dark/20 active:scale-95">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-3 bg-dark text-pure-white px-5 py-2 rounded-full mb-10 shadow-xl">
                <Icon name="BiStar" className="text-primary text-lg" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Perpustakaan Generasi Baru</span>
              </div>
              
              <h1 className="text-7xl lg:text-[100px] font-black leading-[0.85] mb-10 tracking-tighter text-dark">
                Jelajahi <br />
                <span className="text-primary">Dunia</span> <br />
                Tanpa Batas.
              </h1>
              
              <p className="text-xl text-gray-400 max-w-lg mb-12 font-medium leading-relaxed mx-auto lg:mx-0">
                Langkah pertama menuju pengetahuan tanpa batas. Kelola koleksi buku Anda dengan cara yang elegan, cepat, dan modern.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/register" className="group bg-primary text-pure-white px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-dark transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-4">
                  Mulai Sekarang 
                  <Icon name="BiRightArrowAlt" className="text-2xl group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/login" className="bg-white border border-gray-200 text-dark px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-widest hover:border-dark transition-all flex items-center justify-center">
                  Eksplorasi Katalog
                </Link>
              </div>

              {/* Stats Mini */}
              <div className="mt-16 grid grid-cols-3 gap-8 pt-10 border-t border-gray-50">
                {[
                    { label: "Buku", value: "30k+" },
                    { label: "Pembaca", value: "10k+" },
                    { label: "Rating", value: "4.9/5" }
                ].map((s, i) => (
                    <div key={i}>
                        <p className="text-3xl font-black text-dark tracking-tighter">{s.value}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
                    </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative group">
                    <div className="absolute inset-0 bg-primary/20 rounded-[4rem] rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
                    <div className="relative z-10 bg-dark p-3 rounded-[3.5rem] shadow-2xl overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000&auto=format&fit=crop" 
                            alt="Modern Library" 
                            className="rounded-[3rem] w-full h-[600px] object-cover opacity-90 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
                        <div className="absolute bottom-12 left-12 right-12">
                            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                                <p className="text-pure-white text-xs font-black uppercase tracking-[0.3em] mb-2">Pilihan Editor</p>
                                <h4 className="text-2xl font-black text-pure-white tracking-tight">Membangun Masa Depan Lewat Literasi Digital</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid Style */}
      <section className="py-32 px-6 bg-dark relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-7xl font-black text-pure-white tracking-tighter uppercase mb-6">
                Platform Masa Depan
            </h2>
            <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Semua yang Anda butuhkan dalam satu tempat</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[600px]">
            <div className="md:col-span-3 bg-white/5 rounded-[3rem] p-12 border border-white/5 hover:bg-primary transition-all group overflow-hidden relative">
              <Icon name="BiLibrary" className="text-7xl text-primary group-hover:text-pure-white transition-colors mb-8" />
              <h3 className="text-3xl font-black text-pure-white uppercase tracking-tighter mb-4">Katalog Terintegrasi</h3>
              <p className="text-gray-400 group-hover:text-pure-white/80 transition-colors leading-relaxed font-medium">Cari dan temukan ribuan judul buku dari penulis favorit Anda dengan filter pencarian yang sangat akurat.</p>
              <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon name="BiLibrary" className="text-[200px] text-pure-white" />
              </div>
            </div>
            
            <div className="md:col-span-3 bg-white/5 rounded-[3rem] p-12 border border-white/5 hover:bg-dark transition-all group overflow-hidden relative">
              <Icon name="BiRocket" className="text-7xl text-primary mb-8" />
              <h3 className="text-3xl font-black text-pure-white uppercase tracking-tighter mb-4">Akses Instan</h3>
              <p className="text-gray-400 leading-relaxed font-medium">Kecepatan adalah kunci. Akses dashboard Anda dalam milidetik tanpa hambatan teknis apapun.</p>
              <div className="absolute -bottom-10 -right-10 opacity-5">
                <Icon name="BiRocket" className="text-[250px] text-primary" />
              </div>
            </div>

            <div className="md:col-span-2 bg-white/5 rounded-[3rem] p-10 border border-white/5 flex flex-col items-center text-center group hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-pure-white text-3xl mb-6">
                    <Icon name="BiShieldQuarter" />
                </div>
                <h4 className="text-lg font-black text-pure-white uppercase tracking-widest mb-3">Privasi Aman</h4>
                <p className="text-gray-500 text-sm font-medium">Enkripsi data pengguna tingkat tinggi.</p>
            </div>

            <div className="md:col-span-2 bg-white/5 rounded-[3rem] p-10 border border-white/5 flex flex-col items-center text-center group hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-pure-white text-3xl mb-6">
                    <Icon name="BiDevices" />
                </div>
                <h4 className="text-lg font-black text-pure-white uppercase tracking-widest mb-3">Multi-Device</h4>
                <p className="text-gray-500 text-sm font-medium">Buka dari HP, Tablet, atau PC.</p>
            </div>

            <div className="md:col-span-2 bg-white/5 rounded-[3rem] p-10 border border-white/5 flex flex-col items-center text-center group hover:border-primary/50 transition-all">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-pure-white text-3xl mb-6">
                    <Icon name="BiSupport" />
                </div>
                <h4 className="text-lg font-black text-pure-white uppercase tracking-widest mb-3">Dukungan 24/7</h4>
                <p className="text-gray-500 text-sm font-medium">Tim kami siap membantu Anda kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
            <Icon name="BiSolidQuoteLeft" className="text-6xl text-primary/20 mx-auto mb-10" />
            <h3 className="text-3xl lg:text-5xl font-black text-dark tracking-tight leading-tight mb-12">
                "PerpusKu mengubah cara saya mengelola referensi belajar. Desainnya sangat bersih dan fiturnya benar-benar membantu saya menemukan buku favorit dalam sekejap!"
            </h3>
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-dark rounded-full mb-4 shadow-xl flex items-center justify-center text-pure-white text-2xl font-black">JD</div>
                <p className="font-black text-dark uppercase tracking-widest">Jidai Dev</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Fullstack Engineer</p>
            </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-primary rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(24,131,255,0.3)]">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
                <h2 className="text-5xl lg:text-7xl font-black text-pure-white tracking-tighter mb-10">
                    Siap Memulai <br /> Petualangan Literasi?
                </h2>
                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                    <Link to="/register" className="bg-dark text-pure-white px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                        Bergabung Gratis
                    </Link>
                    <Link to="/login" className="bg-white/10 backdrop-blur-md text-pure-white border border-white/20 px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        Masuk Akun
                    </Link>
                </div>
            </div>
        </div>
      </section>

      {/* Footer Premium Final */}
      <footer className="py-20 bg-pure-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6 justify-center md:justify-start">
                    <div className="w-10 h-10 bg-dark rounded-xl p-2 flex items-center justify-center shadow-lg">
                        <img src="/logo.svg" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase">{import.meta.env.VITE_APP_NAME.slice(0, -2)}<span className="text-primary">{import.meta.env.VITE_APP_NAME.slice(-2)}</span></span>
                </div>
                <p className="text-gray-400 font-medium max-w-sm leading-relaxed mx-auto md:mx-0">
                    Sistem perpustakaan digital tercanggih untuk masa depan literasi Anda.
                </p>
            </div>
            <div>
                <h5 className="font-black text-dark uppercase tracking-widest mb-6 text-xs">Platform</h5>
                <ul className="space-y-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
                    <li className="hover:text-primary transition-colors cursor-pointer">Katalog Buku</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Penulis Terpopuler</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Fitur Baru</li>
                </ul>
            </div>
            <div>
                <h5 className="font-black text-dark uppercase tracking-widest mb-6 text-xs">Perusahaan</h5>
                <ul className="space-y-4 text-gray-500 font-bold text-xs uppercase tracking-widest">
                    <li className="hover:text-primary transition-colors cursor-pointer">Tentang Kami</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Kebijakan</li>
                    <li className="hover:text-primary transition-colors cursor-pointer">Kontak</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
                &copy; {new Date().getFullYear()} {import.meta.env.VITE_APP_NAME} Digital System
            </p>
            <div className="flex gap-6 text-gray-400">
                <Icon name="BiLogoFacebookCircle" className="text-xl hover:text-primary cursor-pointer" />
                <Icon name="BiLogoInstagram" className="text-xl hover:text-primary cursor-pointer" />
                <Icon name="BiLogoTwitter" className="text-xl hover:text-primary cursor-pointer" />
            </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
