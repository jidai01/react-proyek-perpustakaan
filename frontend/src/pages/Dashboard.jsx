/**
 * @file Dashboard.jsx
 * @description Komponen halaman utama yang menampilkan daftar buku menggunakan DataTables.
 * Halaman ini mengimplementasikan logika RBAC di mana hanya pengguna dengan role 'admin'
 * yang dapat melihat tombol aksi (Tambah, Edit, Hapus).
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as BiIcons from "react-icons/bi";

// Ambil JQuery dari window (karena di-load via CDN di index.html)
const $ = window.$;

// Helper untuk render ikon
const Icon = ({ name, className }) => {
  const IconComponent = BiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Dashboard = () => {
  const [buku, setBuku] = useState([]);
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [idEdit, setIdEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  // Inisialisasi DataTables
  useEffect(() => {
    if (!loading && buku.length >= 0) {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
      }

      dataTableInstance.current = $(tableRef.current).DataTable({
        data: buku,
        columns: [
          { 
            title: "No.", 
            data: null, 
            render: (data, type, row, meta) => meta.row + 1,
            width: "5%" 
          },
          { title: "Judul", data: "judul" },
          { title: "Penulis", data: "penulis" },
          isAdmin ? {
            title: "Aksi",
            data: null,
            orderable: false,
            render: (data) => `
              <div class="flex gap-2 justify-center">
                <button class="edit-btn w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1883FF] hover:bg-blue-50 transition-colors" data-id="${data.id}" data-judul="${data.judul}" data-penulis="${data.penulis}">
                  <i class="bi bi-pencil-square text-lg"></i>
                </button>
                <button class="delete-btn w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors" data-id="${data.id}">
                  <i class="bi bi-trash text-lg"></i>
                </button>
              </div>
            `,
          } : null,
        ].filter(Boolean),
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json",
        },
        responsive: true,
        destroy: true,
      });

      $(tableRef.current).on("click", ".edit-btn", function() {
        handleEdit($(this).data("id"), $(this).data("judul"), $(this).data("penulis"));
      });

      $(tableRef.current).on("click", ".delete-btn", function() {
        hapusBuku($(this).data("id"));
      });
    }

    return () => {
      if (dataTableInstance.current) {
        $(tableRef.current).off("click", ".edit-btn");
        $(tableRef.current).off("click", ".delete-btn");
      }
    };
  }, [buku, loading]);

  const ambilDataBuku = useCallback(
    async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/buku`, {
          params: { limit: 1000 },
          headers: { Authorization: `Bearer ${token}` }
        });
        setBuku(res.data.data || []);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    ambilDataBuku();
  }, [ambilDataBuku]);

  const simpanBuku = async (e) => {
    e.preventDefault();
    if (!judul.trim() || !penulis.trim()) return;
    const url = idEdit ? `${import.meta.env.VITE_API_URL}/buku/${idEdit}` : `${import.meta.env.VITE_API_URL}/buku`;
    const method = idEdit ? "put" : "post";
    try {
      await axios[method](url, { judul, penulis }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: 'success', title: 'Berhasil Disimpan', confirmButtonColor: '#1883FF' });
      setJudul("");
      setPenulis("");
      setIdEdit(null);
      ambilDataBuku();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.response?.data?.message || 'Error' });
    }
  };

  const handleEdit = (id, j, p) => {
    setJudul(j);
    setPenulis(p);
    setIdEdit(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapusBuku = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data ini akan dihapus secara permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1883FF',
      cancelButtonColor: '#121214',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/buku/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ icon: 'success', title: 'Terhapus', confirmButtonColor: '#1883FF' });
        ambilDataBuku();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal hapus' });
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark tracking-tighter uppercase mb-2">Katalog Buku</h1>
        <div className="h-1.5 w-20 bg-primary rounded-full"></div>
      </div>

      {isAdmin && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <Icon name="BiBookAdd" className="text-8xl text-dark" />
          </div>
          
          <h2 className="text-xl font-black text-dark uppercase tracking-widest mb-8 flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                  <Icon name={idEdit ? "BiPencil" : "BiPlusCircle"} />
              </div>
              {idEdit ? "Edit Buku" : "Tambah Buku Baru"}
          </h2>

          <form onSubmit={simpanBuku} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Judul Buku</label>
              <input
                type="text"
                placeholder="Masukkan judul buku..."
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nama Penulis</label>
              <input
                type="text"
                placeholder="Masukkan nama penulis..."
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium"
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-dark transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center gap-3"
              >
                <Icon name="BiSave" className="text-lg" />
                Simpan Data
              </button>
              {idEdit && (
                <button
                  type="button"
                  onClick={() => { setIdEdit(null); setJudul(""); setPenulis(""); }}
                  className="bg-gray-100 text-gray-500 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Daftar Koleksi Buku</h3>
            <div className="p-2 bg-primary/5 rounded-xl text-primary">
                <Icon name="BiTable" className="text-2xl" />
            </div>
        </div>
        
        {loading ? (
            <div className="flex flex-col items-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Memuat Data...</p>
            </div>
        ) : (
            <div className="table-responsive custom-datatable">
                <table ref={tableRef} className="w-full table-auto"></table>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
