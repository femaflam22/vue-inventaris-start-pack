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
    <!-- Pesan sukses atau error -->
    <div class="mt-3" v-if="message">
      <div class="alert" :class="{ 'alert-success': success, 'alert-danger': !success }">
        {{ message }}
      </div>
    </div>

    <input v-model="search" placeholder="Cari nama atau ID..." class="form-control mt-4 mb-3" />

    <!-- : mengisi props. :data, :tableTh, :tableTd dari nama props di components Table. yg di "" dari bagian data() {..} -->
    <StuffTable :data="filteredStuffs" :tableTh="tableTh" :tableTd="tableTd" :actionBtn="actionBtn" :itemDetail="itemDetail" @edit-item="handleEdit" @delete-item="deleteItem" title="Daftar Barang" :exportBtn="['export-pdf', 'export-excel']" @export-pdf="printPDF" @export-excel="exportExcel" />
  </div>
</template>

<script>
import StuffTable from "../components/Table.vue"; // Komponen untuk tabel
import axios from "axios";
import { API_BASE_URL } from "../constant.js"; // Konstanta URL base dari API
import { useRouter } from "vue-router";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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
      message: "", //Pesan message nya
      success: false,
      selectedItem: {},
      // judul column table (th)
      tableTh: ["No", "Nama", "Tipe", "Aksi"],
      // isi td : field dari api
      // no dan aksi sudah memiliki td di tablenya
      tableTd: ["name", "type"],
      actionBtn: ["edit", "delete", "detail"],
      itemDetail: ["name", "type"]
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
    fetchStuffs() {
      axios.get(API_BASE_URL + "/stuffs", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem('access_token')
        }
      })
      .then(res => {
        this.stuffs = res.data.data;
        console.log(res)
      })
      .catch(err => {
        if (err.status == 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          const router = useRouter();
          router.replace('/'); 
        }
        console.error("Gagal ambil data:", err);
        this.message = "Gagal memproses data!";
      })
    },

    submitForm() {
      if (this.isEdit) {
        axios.patch(API_BASE_URL + "/stuffs/" + this.form.id, this.form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        })
        .then(res => {
          this.success = true;
          this.message = "Berhasil mengubah data!";
          this.resetForm();     // Kosongkan form setelah submit
          this.fetchStuffs();   // Refresh data
        })
        .catch(err => {
          if (err.status == 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            const router = useRouter();
            router.replace('/'); 
          }
          console.error("Gagal kirim data:", err);
          this.message = "Gagal Menambahkan Barang!";
          this.success = false;
        })
      } else {
        axios.post(API_BASE_URL + "/stuffs", this.form, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
          }
        })
        .then(res => {
          this.success = true;
          this.message = "Berhasil menambahkan data!";
          this.resetForm();     // Kosongkan form setelah submit
          this.fetchStuffs();   // Refresh data
        })
        .catch(err => {
          if (err.status == 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
            const router = useRouter();
            router.replace('/'); 
          }
          console.error("Gagal kirim data:", err);
          this.message = "Gagal Menambahkan Barang!";
          this.success = false;
        })
      }
    },

    // Siapkan data untuk proses edit
    handleEdit(item) {
      this.form = { ...item }; // Copy data ke form
      this.isEdit = true;
    },

    // Hapus barang (hapus langsung, tapi nanti bisa disesuaikan untuk soft delete)
    deleteItem(id) {
      axios.delete(API_BASE_URL + "/stuffs/" + id, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token")
        }
      })
      .then(res => {
        this.success = true;
        this.message = "Berhasil menghapus data!";
        this.fetchStuffs();
      })
      .catch(err => {
        if (err.status == 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          const router = useRouter();
          router.replace('/'); 
        }
        console.error("Gagal hapus:", err);
      })
    },
    // Reset form ke kondisi awal
    resetForm() {
      this.form = { id: null, name: "", type: "" };
      this.isEdit = false;
    },
    printPDF() {
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Daftar Barang", 20, 20);

      let yPosition = 30;  // Menentukan posisi vertikal
      doc.setFontSize(12);
      
      // Menambahkan header
      doc.text("No", 20, yPosition);
      doc.text("Nama", 40, yPosition);
      doc.text("Tipe", 100, yPosition);
      yPosition += 10;

      // Menambahkan data barang
      this.stuffs.forEach((item, index) => {
        doc.text((index + 1).toString(), 20, yPosition);
        doc.text(item.name, 40, yPosition);
        doc.text(item.type, 100, yPosition);
        yPosition += 10;
      });

      // Menyimpan PDF
      doc.save("daftar_barang.pdf");
    },
    exportExcel() {
      const ws = XLSX.utils.json_to_sheet(this.stuffs.map(item => ({
        No: this.stuffs.indexOf(item) + 1,
        Nama: item.name,
        Tipe: item.type
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daftar Barang");
      XLSX.writeFile(wb, "daftar_barang.xlsx");
    }
  },
  // Ketika komponen dimount, ambil data barang
  mounted() {
    this.fetchStuffs();
  }
};
</script>
