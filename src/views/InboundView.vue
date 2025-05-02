<template>
    <div class="container my-4">
        <div class="mt-3" v-if="message">
            <div class="alert" :class="{ 'alert-success': success, 'alert-danger': !success }">
                {{ message }}
            </div>
        </div>

        <Table title="Data Inbound Stuffs" :data="inbounds" :tableTd="tableTd" :tableTh="tableTh" :actionBtn="actionBtn" :itemDetail="itemDetail" @delete-item="deleteInbound" />
    </div>
</template>

<script>
import Table from '@/components/Table.vue';
import { API_BASE_URL } from '@/constant';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: "InboundView",
    components: { Table },
    data() {
        return {
            inbounds: [],
            tableTh: ["No", "Stuff Name", "Total Item (+)", "Proof File"],
            tableTd: ["stuff.name", "total", "proof_file"],
            actionBtn: ["delete", "detail"],
            itemDetail: ["proof_file"],
            message: "",
            success: false,
        }
    },
    methods: {
        fetchData() {
            axios.get(API_BASE_URL + "/inbound-stuffs", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            })
            .then(res => {
                this.inbounds = res.data.data;
            })
            .catch(err => {
                if (err.status == 401) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("access_token");
                    const router = useRouter();
                    router.replace('/'); 
                }
                this.message = "Gagal mengambil data!";
                console.log(err);
            })
        },
        deleteInbound(id) {
            axios.delete(API_BASE_URL + "/inbound-stuffs/" + id, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                }
            })
            .then(res => {
                this.message = "Berhasil menghapus data inbound!";
                this.success = true;
                this.fetchData();
            })
            .catch(err => {
                if (err.status == 401) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("access_token");
                    const router = useRouter();
                    router.replace('/'); 
                }
                this.message = "Gagal mengambil data!";
                console.log(err);
            })
        }
    },
    mounted() {
        this.fetchData();
    }
}
</script>