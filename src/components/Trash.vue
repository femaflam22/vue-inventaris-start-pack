<!-- src/views/TrashView.vue -->
<template>
    <div class="container py-4">
      <h2>Trash Barang</h2>
  
      <StuffTable
        :stuffs="trashedItems"
        :isTrash="true"
        @restore-item="restoreItem"
        @delete-permanent="deletePermanent"
      />
    </div>
  </template>
  
  <script>
  import StuffTable from "../components/Table.vue";
  import axios from "axios";
  import { API_BASE_URL } from "../constant"; // sesuaikan path kalau perlu
  
  export default {
    name: "TrashView",
    components: { StuffTable },
    data() {
      return {
        trashedItems: [],
        isLoading: false,
        error: null,
      };
    },
    methods: {
      async fetchTrashed() {
        this.isLoading = true;
        this.error = null;
        const token = localStorage.getItem("access_token");
        try {
          const res = await axios.get(`${API_BASE_URL}/stuffs/trash`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.trashedItems = res.data.data;
        } catch (err) {
          this.error = "Gagal memuat data trash.";
          console.error(err);
        } finally {
          this.isLoading = false;
        }
      },
  
      async restoreItem(id) {
        const token = localStorage.getItem("access_token");
        try {
          await axios.get(`${API_BASE_URL}/stuffs/trash/restore/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.fetchTrashed();
        } catch (err) {
          console.error("Gagal restore:", err);
        }
      },
  
      async deletePermanent(id) {
        const token = localStorage.getItem("access_token");
        try {
          await axios.delete(`${API_BASE_URL}/stuffs/trash/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          this.fetchTrashed();
        } catch (err) {
          console.error("Gagal hapus permanen:", err);
        }
      }
    },
    mounted() {
      this.fetchTrashed();
    },
  };
  </script>
  