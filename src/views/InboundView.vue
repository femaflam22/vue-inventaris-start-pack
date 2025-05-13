<template>
    <div class="container my-4">
        <h1>Inbound Stuff (pemasukan stok)</h1>

        <StuffTable :data="inbounds" :tableTh="['No', 'Nama Barang', 'Total Penambahan', 'Bukti Foto', 'Aksi']" :tableTd="['stuff.name', 'total', 'proof_file']" :actionBtn="['detail', 'delete']" :itemDetail="['proof_file']" />
    </div>
</template>

<script>
import StuffTable from "../components/Table.vue"; 
import axios from "axios";
import { API_BASE_URL } from "../constant.js"; 
import { useRouter } from "vue-router";

export default {
    name: 'InboundView',
    components: { StuffTable },
    data() {
        return {
            inbounds: [],
            message: "",
            success: false
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
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>