<template>
    <div class="container my-4">
        <h1>Inbound Stuff (pemasukan stok)</h1>

        <div class="d-flex justify-content-end">
            <!-- ketika di klik mengubah nilai data showModal menjadi true agar ModalForm muncul -->
            <button class="btn btn-success" @click="() => showModal = true">(+)New Inbound</button>
        </div>

        <StuffTable :data="inbounds" :tableTh="['No', 'Nama Barang', 'Total Penambahan', 'Bukti Foto', 'Aksi']" :tableTd="['stuff.name', 'total', 'proof_file']" :actionBtn="['detail', 'delete']" :itemDetail="['proof_file']" title="Daftar Penambahan Stok" :exportBtn="['export-excel']" @export-excel="exportExcel" />

        <ModalForm modalTitle="Tambah Stok Barang" :isModalOpen="showModal" @close-modal="() => showModal = false">
            <!-- isi slot ditengah tag component -->
             <div class="alert alert-danger" v-if="Object.keys(errors).length > 0">
                <!-- jika errors.data memiliki nilai (Err validasi) -->
                <ol v-if="Object.keys(errors.data).length > 0">
                    <li v-for="(err, i) in errors.data" :key="i">{{ err[0] }}</li>
                </ol>
                <!-- jika bukan err validasi munculkan bagian message err nya -->
                <span v-else>{{ errors.message }}</span>
             </div>
            <form>
                <div class="mb-3">
                    <label for="stuff_id" class="form-label">Stuff :</label>
                    <select id="stuff_id" class="form-select" v-model="payload.stuff_id">
                        <option selected disabled hidden>Pilih Barang</option>
                        <option v-for="(stuff, i) in stuffs" :key="i" :value="stuff.id">{{ stuff.name }}</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="total" class="form-label">Total Item :</label>
                    <input type="number" id="total" class="form-control" v-model="payload.total">
                </div>
                <div class="mb-3">
                    <label for="proof_file" class="form-label">Proof File (Image) :</label>
                    <!-- untuk file tdk bisa menggunakan v-model untuk mengisi data payload, gunakan change dan ambil target files[0] -->
                    <input type="file" id="proof_file" class="form-control" @change="(e) => payload.proof_file = e.target.files[0]">
                </div>
                <div class="d-grid gap-2">
                    <button type="button" class="btn btn-primary" @click="handleSubmitForm">Submit</button>
                </div>
            </form>
        </ModalForm>
    </div>
</template>

<script>
import StuffTable from "../components/Table.vue"; 
import axios from "axios";
import { API_BASE_URL } from "../constant.js"; 
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import ModalForm from "@/components/ModalForm.vue";

export default {
    name: 'InboundView',
    components: { StuffTable, ModalForm },
    data() {
        return {
            inbounds: [],
            message: "",
            success: false,
            // penentu modal muncul/tdk
            showModal: false,
            stuffs: [],
            payload: {
                stuff_id: "",
                total: 0,
                proof_file: null
            },
            errors: []
        }
    },
    methods: {
        fetchData() {
            axios.get(API_BASE_URL + "/inbound-stuffs", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            })
            .then(res => this.inbounds = res.data.data)
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
        exportExcel() {
            const ws = XLSX.utils.json_to_sheet(this.inbounds.map(item => ({
                No: this.inbounds.indexOf(item) + 1,
                NamaBarang: item.stuff?.name, // ?. : ? pengecekan ada/tdk nilai . meneruskan (memutuskan ambil/tdknya data name dr stuff)
                TotalItem: item.total,
                BuktiFoto: item.proof_file,
                TglPemasukanBarang: new Date(item.created_at).toLocaleDateString('id-ID', {dateStyle: 'long'}) //2025-05-15 : 15 mei 2025
            })));

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Daftar Penambahan Stok");
            XLSX.writeFile(wb, "daftar_penambahan_barang.xlsx");
        },
        fetchStuffs() {
            axios.get(API_BASE_URL+"/stuffs", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            })
            .then(res => this.stuffs = res.data.data)
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
        handleSubmitForm() {
            // untuk mengirim data ke api dengan file (image) didlmnya
            let formData = new FormData();
            formData.append('stuff_id', this.payload.stuff_id);
            formData.append('total', this.payload.total);
            formData.append('proof_file', this.payload.proof_file);
            axios.post(API_BASE_URL+"/inbound-stuffs", formData, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('access_token')
                }
            })
            .then(res => {
                this.showModal = false; // tutup modal
                this.message = "Berhasil menambahkan stok barang!"; //pesan di alert
                this.success = true; //tipe alert success
                this.payload = {
                    stuff_id: "",
                    total: 0,
                    proof_file: null
                }; //reset payload
                this.fetchData(); //reload data inbounds terbaru
                this.errors = []; //kosngkan err
            })
            .catch(err => {
                if (err.status == 401) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("access_token");
                    const router = useRouter();
                    router.replace('/'); 
                }
                console.error("Gagal ambil data:", err);
                this.errors = err.response.data; //ambil data error
            })
        }
    },
    mounted() {
        this.fetchData();
        this.fetchStuffs();
    }
}
</script>