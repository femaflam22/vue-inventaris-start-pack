<template>
  <!-- Container utama -->
  <div class="mt-5">
    <h4>Daftar Barang</h4>

    <!-- Tombol-tombol aksi -->
    <div class="d-flex gap-3 mb-3">
      <!-- Tombol untuk Cetak PDF dengan ikon -->
      <button class="btn btn-primary" @click="printPDF">
        <i class="bi bi-file-earmark-pdf"></i> Cetak PDF
      </button>

      <!-- Tombol untuk Ekspor ke Excel dengan ikon -->
      <button class="btn btn-success" @click="exportExcel">
        <i class="bi bi-file-earmark-excel"></i> Ekspor ke Excel
      </button>
    </div>

    <!-- Tabel barang -->
    <div class="table-responsive">
      <table class="table table-bordered mt-3">
        <thead>
          <tr>
            <th v-for="(th, index) in tableTh" :key="index">{{ th }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data" :key="index">
            <td>{{ index + 1 }}</td>
            <td v-for="(td, i) in tableTd" :key="i">
              <img v-if="td == 'proof_file'" :src="item[td]" width="50">
              <span v-else-if="td.includes('.')">
                {{ getNestedValue(item, td) }}
              </span>
              <span v-else>{{ item[td] }}</span>
            </td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <template v-if="!isTrash">
                  <button v-if="actionBtn.includes('edit')" class="btn btn-warning btn-sm"
                    @click="$emit('edit-item', item)">
                    <i class="bi bi-pencil"></i> Edit
                  </button>
                  <button v-if="actionBtn.includes('delete')" class="btn btn-danger btn-sm"
                    @click="$emit('delete-item', item.id)">
                    <i class="bi bi-trash"></i> Hapus
                  </button>
                  <button v-if="actionBtn.includes('detail')" class="btn btn-info btn-sm" @click="openDetail(item)">
                    <i class="bi bi-eye"></i> Detail
                  </button>
                </template>
                <template v-else>
                  <button class="btn btn-success btn-sm" @click="$emit('restore-item', item.id)">
                    <i class="bi bi-arrow-repeat"></i> Restore
                  </button>
                  <button class="btn btn-danger btn-sm" @click="$emit('delete-permanent', item.id)">
                    <i class="bi bi-trash-fill"></i> Hapus Permanen
                  </button>
                </template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="data.length === 0" class="text-muted">Belum ada data barang.</p>

    <!-- Modal detail, tampil jika showModal = true -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog"
      style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <!-- Header modal -->
          <div class="modal-header">
            <h5 class="modal-title">Detail Barang</h5>
            <button type="button" class="btn-close" @click="closeDetail"></button> <!-- Tombol tutup -->
          </div>
          <!-- Isi modal -->
          <div class="modal-body">
            <p v-for="(item, index) in itemDetail" :key="index">
              <img v-if="item == 'proof_file'" :src="selectedItem[item]" width="400" />
              <span v-else><strong class="text-capitalize">{{ item }} : </strong>{{ selectedItem[item] }}</span>
            </p>
          </div>
          <!-- Footer modal -->
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeDetail">Tutup</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export default {
  name: "StuffTable",
  props: {
    data: {
      type: Array,
      required: true
    },
    tableTh: {
      type: Array,
      required: true
    },
    tableTd: {
      type: Array,
      required: true
    },
    actionBtn: {
      type: Array,
      required: true
    },
    itemDetail: {
      type:Array,
      default: []
    },
    isTrash: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showModal: false,
      selectedItem: {}
    };
  },
  methods: {
    getNestedValue(item, key) {
      const keys = key.split('.');
      let current = item;
      for (const key of keys) {
        if (!current || typeof current !== 'object' || !(key in current)) {
          return undefined;
        }
        current = current[key];
      }
      return current;
    },
    openDetail(item) {
      this.selectedItem = item;
      this.showModal = true;
    },
    closeDetail() {
      this.showModal = false;
      this.selectedItem = {};
    },
    // Menambahkan metode untuk mencetak PDF
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
      this.data.forEach((item, index) => {
        doc.text((index + 1).toString(), 20, yPosition);
        doc.text(item.name, 40, yPosition);
        doc.text(item.type, 100, yPosition);
        yPosition += 10;
      });

      // Menyimpan PDF
      doc.save("daftar_barang.pdf");
    },
    exportExcel() {
      const ws = XLSX.utils.json_to_sheet(this.data.map(item => ({
        No: this.data.indexOf(item) + 1,
        Nama: item.name,
        Tipe: item.type
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daftar Barang");
      XLSX.writeFile(wb, "daftar_barang.xlsx");
    }
  }
};
</script>


<style scoped>
/* Responsive style untuk ukuran layar kecil */
@media (max-width: 576px) {
  .table thead {
    display: none;
    /* Sembunyikan header tabel */
  }

  .table,
  .table tbody,
  .table tr,
  .table td {
    display: block;
    width: 100%;
    /* Tabel jadi blok untuk mode mobile */
  }

  .table td {
    text-align: right;
    padding-left: 50%;
    /* Buat space di kiri untuk label */
    position: relative;
  }

  .table td::before {
    content: attr(data-label);
    /* Label dari atribut */
    position: absolute;
    left: 10px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    font-weight: bold;
    text-align: left;
  }
}

/* Tampilkan modal manual tanpa JS Bootstrap */
.modal.fade.show {
  display: block;
}
</style>
