<template>
    <div class="container py-4">
      <h2>Kelola Barang</h2>
  
      <!-- Form Tambah/Edit Barang -->
      <form @submit.prevent="submitForm">
        <div class="mb-2">
          <label>Nama Barang:</label>
          <input v-model="form.name" class="form-control" required />
        </div>
        <div class="mb-2">
          <label>Tipe Barang:</label>
          <select v-model="form.type" class="form-control" required>
            <option value="" disabled>Pilih tipe</option>
            <option value="Lab">Lab</option>
            <option value="HTL/KLN">HTL/KLN</option>
            <option value="Sarpras">Sarpras</option>
          </select>
        </div>
          <button class="btn btn-primary mb-2 d-flex">{{ isEdit ? 'Update' : 'Tambah' }}</button>
        </form>
        <!-- <form>
          <button class="btn btn-success" @click="openDetail(item)">Inbound Stuffs</button>
        </form>
         -->
      <!-- Pesan sukses atau error -->
      <div class="mt-3" v-if="message">
        <div class="alert" :class="{'alert-success': success, 'alert-danger': !success}">
          {{ message }}
        </div>
      </div>
  
      <!-- Input untuk pencarian -->
      <input
        v-model="search"
        placeholder="Cari nama atau ID..."
        class="form-control mt-4 mb-3"
      />


      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!-- Header modal -->
          <div class="modal-header">
            <h5 class="modal-title">Detail Barang</h5>
            <button type="button" class="btn-close" @click="closeDetail"></button> <!-- Tombol tutup -->
          </div>
          <!-- Isi modal -->
          <div class="modal-body">
            <p><strong>Id:</strong> {{ stuffs.indexOf(selectedItem) + 1 }}</p>
            <p><strong>Nama:</strong> {{ selectedItem.name }}</p>
            <p><strong>Tipe:</strong> {{ selectedItem.type }}</p>
            <!-- Tambahkan detail tambahan jika diperlukan -->
          </div>
          <!-- Footer modal -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetail">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  
      <!-- Komponen Tabel untuk menampilkan data -->
    <!-- Data barang yang difilter -->
     <!-- Jumlah item per halaman -->
      <!-- Halaman saat ini -->
       <!-- Mengganti halaman -->
        <!-- Edit item -->
          <!-- Soft delete item -->
      <StuffTable
        :stuffs="filteredStuffs"         
        :itemsPerPage="5"                
        :currentPage="currentPage"       
        @change-page="currentPage = $event"  
        @edit-item="handleEdit"          
        @delete-item="deleteItem"     
        @detail-item="detailStuff"
      />
    </div>
  </template>
  
  <script>
  import StuffTable from "../components/Table.vue"; // Komponen untuk tabel
  import axios from "axios";
  import { API_BASE_URL } from "../constant.js"; // Konstanta URL base dari API
  
  export default {
    name: "StuffView",
    components: { StuffTable },
    data() {
      return {
        stuffs: [], // Daftar barang yang ditampilkan
        form: {
          id: null,
          name: "",
          type: ""
        },
        isEdit: false, // Penanda apakah sedang edit atau tambah
        search: "",    // Kata kunci pencarian
        currentPage: 1, // Halaman aktif
        message: "", //Pesan message nya
        success: false,
        showModal: false,     // Untuk mengontrol visibilitas modal
        selectedItem: {}
      };
    },
    // Fungsi computed adalah  untuk Menghasilkan nilai baru berdasarkan data atau props
    computed: {
      // Data barang yang disaring berdasarkan pencarian
      filteredStuffs() {
        if (!this.search) return this.stuffs;
        const s = this.search.toLowerCase();
        return this.stuffs.filter(item =>
          item.name.toLowerCase().includes(s) ||
          String(item.id).includes(s)
        );
      }
    },
    methods: {
      // Ambil semua data barang dari API
      async fetchStuffs() {
        const token = localStorage.getItem("access_token");
        try {
          const res = await axios.get(`${API_BASE_URL}/stuffs`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.stuffs = res.data.data;
        } catch (err) {
          console.error("Gagal ambil data:", err);
        }
      },
  
      // Tambah atau update data barang
      async submitForm() {
        const token = localStorage.getItem("access_token");
        try {
          if (this.isEdit) {
            // Jika sedang edit, update data
            await axios.patch(`${API_BASE_URL}/stuffs/${this.form.id}`, this.form, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } else {
            // Jika tidak edit, maka tambah data baru
            const res = await axios.post(`${API_BASE_URL}/stuffs`, this.form, {
              headers: { Authorization: `Bearer ${token}` }
            });
            this.stuffs.unshift(res.data.data); // Tambah item ke daftar
            this.message = "Berhasil Menambahkan Barang!"
            this.success = true
          }
  
          this.resetForm();     // Kosongkan form setelah submit
          this.fetchStuffs();   // Refresh data
        } catch (err) {
          console.error("Gagal kirim data:", err);
          this.message = "Gagal Menambahkan Barang!"
          this.success = false
        }
      },
  
      // Siapkan data untuk proses edit
      handleEdit(item) {
        this.form = { ...item }; // Copy data ke form
        this.isEdit = true;
      },
  
      // Hapus barang (hapus langsung, tapi nanti bisa disesuaikan untuk soft delete)
      async deleteItem(id) {
        const token = localStorage.getItem("access_token");
        try {
          await axios.delete(`${API_BASE_URL}/stuffs/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Hapus dari daftar lokal
          this.stuffs = this.stuffs.filter(item => item.id !== id);
        } catch (err) {
          console.error("Gagal hapus:", err);
        }
      },
  
      // Fungsi Detail Stuff
      async detailStuff(id) {
        const token = localStorage.getItem("access_token");
        try {
        await axios.get(`${API_BASE_URL}/stuffs/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.message = "Berhasil Mengambil data!"
          this.success = true
        } catch (err) {
          console.error("Gagal hapus:", err);
        }
      },

      // Inbound Stuffs
      async inboundStuff(stuff_id) {
        const token = localStorage.getItem("access_token");
        try {
          
        } catch (error) {
          
        }
      },

      openDetail(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    // Fungsi untuk menutup modal dan reset data
    closeDetail() {
      this.showModal = false;
      this.selectedItem = {};
    },
  
      // Reset form ke kondisi awal
      resetForm() {
        this.form = { id: null, name: "", type: "" };
        this.isEdit = false;
      }
    },
  
    // Ketika komponen dimount, ambil data barang
    mounted() {
      this.fetchStuffs();
    }
  };
  </script>
  