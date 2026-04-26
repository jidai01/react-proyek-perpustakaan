/**
 * @file Users.jsx
 * @description Komponen halaman Manajemen Pengguna.
 * Halaman ini sepenuhnya dikunci (dilindungi) dari non-admin. Jika user biasa memaksa masuk,
 * komponen akan merender pesan "Akses Terbatas".
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as BiIcons from "react-icons/bi";

// Ambil JQuery dari objek window browser
const $ = window.$;

const Icon = ({ name, className }) => {
  const IconComponent = BiIcons[name];
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [idEdit, setIdEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const tableRef = useRef(null);
  const dataTableInstance = useRef(null);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = currentUser.role === "admin";

  useEffect(() => {
    if (!loading && users.length >= 0) {
      if (dataTableInstance.current) {
        dataTableInstance.current.destroy();
      }

      dataTableInstance.current = $(tableRef.current).DataTable({
        data: users,
        columns: [
          { title: "No.", data: null, render: (data, type, row, meta) => meta.row + 1, width: "5%" },
          { title: "Nama Pengguna", data: "username" },
          { 
            title: "Peran", 
            data: "role",
            render: (data) => `
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${data === 'admin' ? 'bg-[#E3F2FD] text-[#1976D2] border border-blue-200' : 'bg-gray-100 text-gray-500'}">
                    ${data.toUpperCase()}
                </span>
            `
          },
          {
            title: "Aksi",
            data: null,
            orderable: false,
            render: (data) => `
              <div class="flex gap-2 justify-center">
                <button class="edit-btn w-9 h-9 rounded-xl bg-[#F0F7FF] border border-blue-100 flex items-center justify-center text-[#1883FF] hover:bg-blue-100 transition-colors" data-id="${data.id}" data-username="${data.username}" data-role="${data.role}">
                  <i class="bi bi-pencil-square text-lg"></i>
                </button>
                ${data.role !== 'admin' ? `
                <button class="delete-btn w-9 h-9 rounded-xl bg-[#FFF5F5] border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors" data-id="${data.id}">
                  <i class="bi bi-trash text-lg"></i>
                </button>` : ''}
              </div>
            `,
          },
        ],
        language: { url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/id.json" },
        responsive: true,
      });

      $(tableRef.current).on("click", ".edit-btn", function() {
        handleEdit($(this).data("id"), $(this).data("username"), $(this).data("role"));
      });

      $(tableRef.current).on("click", ".delete-btn", function() {
        if (!$(this).prop('disabled')) {
            hapusUser($(this).data("id"));
        }
      });
    }
    return () => {
        if (dataTableInstance.current) {
            $(tableRef.current).off("click", ".edit-btn");
            $(tableRef.current).off("click", ".delete-btn");
        }
    }
  }, [users, loading]);

  const ambilDataUser = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        params: { limit: 1000 },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { ambilDataUser(); }, [ambilDataUser]);

  const simpanUser = async (e) => {
    e.preventDefault();
    const url = idEdit ? `${import.meta.env.VITE_API_URL}/users/${idEdit}` : `${import.meta.env.VITE_API_URL}/users`;
    const method = idEdit ? "put" : "post";
    try {
      await axios[method](url, { username, password, role }, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire({ icon: 'success', title: 'User Berhasil Disimpan', confirmButtonColor: '#1883FF' });
      resetForm();
      ambilDataUser();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Error' });
    }
  };

  const handleEdit = (id, u, r) => {
    setIdEdit(id);
    setUsername(u);
    setRole(r);
    setPassword("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hapusUser = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data user akan dihapus secara permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1883FF',
      cancelButtonColor: '#121214',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        Swal.fire({ icon: 'success', title: 'Terhapus', confirmButtonColor: '#1883FF' });
        ambilDataUser();
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'Gagal' });
      }
    }
  };

  const resetForm = () => {
    setIdEdit(null);
    setUsername("");
    setPassword("");
    setRole("user");
    setShowPassword(false);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] animate-fadeIn">
        <Icon name="BiShieldX" className="text-8xl text-red-500 mb-4" />
        <h1 className="text-3xl font-black text-dark mb-2">Akses Terbatas</h1>
        <p className="text-gray-500">Fitur manajemen user hanya tersedia untuk Administrator.</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-dark tracking-tighter uppercase mb-2">Manajemen User</h1>
        <div className="h-1.5 w-20 bg-primary rounded-full"></div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Icon name="BiUserPlus" className="text-8xl text-dark" />
        </div>

        <h2 className="text-xl font-black text-dark uppercase tracking-widest mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Icon name={idEdit ? "BiUserCheck" : "BiUserPlus"} />
            </div>
            {idEdit ? "Edit Data User" : "Tambah User Baru"}
        </h2>

        <form onSubmit={simpanUser} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Username</label>
            <input type="text" placeholder="Masukkan username..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          
          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password {idEdit && "(Opsional)"}</label>
            <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder="Masukkan password..." className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required={!idEdit} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                    <Icon name={showPassword ? "BiHide" : "BiShow"} className="text-xl" />
                </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Role / Peran</label>
            <select className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-primary focus:bg-white outline-none transition-all font-black uppercase tracking-widest text-xs" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">USER</option>
              <option value="admin">ADMIN</option>
            </select>
          </div>

          <div className="md:col-span-3 flex gap-4 mt-4">
            <button type="submit" className="bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-dark transition-all shadow-lg shadow-primary/20 flex items-center gap-3">
              <Icon name="BiCheckDouble" className="text-xl" />
              Simpan Perubahan
            </button>
            {idEdit && (
              <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-500 px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em]">Daftar Pengguna Sistem</h3>
            <div className="p-2 bg-primary/5 rounded-xl text-primary">
                <Icon name="BiGroup" className="text-2xl" />
            </div>
        </div>

        {loading ? (
             <div className="flex flex-col items-center py-20 animate-pulse">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Memuat Data User...</p>
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

export default Users;
