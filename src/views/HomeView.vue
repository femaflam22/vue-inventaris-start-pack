<template>
  <!-- memanggil event dengan @ -->
  <form v-if="!isLoggedIn" class="card d-block mx-auto w-50 p-5 my-5" @submit.prevent="handleLogin">
    <div class="alert alert-danger" v-if="message" role="alert">
      <i class="bi bi-exclamation-triangle-fill"></i> {{ message }}
    </div>
    <div class="alert alert-info" v-if="loading" role="alert">
      <i class="bi bi-hourglass-split"></i> Sedang mengidentifikasi akun anda...
    </div>
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">Username</label>
      <input type="text" class="form-control" id="exampleInputEmail1" v-model="login.username" placeholder="Masukkan Username">
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">Password</label>
      <input type="password" class="form-control" id="exampleInputPassword1" v-model="login.password" placeholder="Masukkan Password">
    </div>
    <button type="submit" class="btn btn-primary" :disabled="loading">Login</button>
  </form>

  <!-- Pesan peringatan jika pengguna sudah login -->
  <div v-if="isLoggedIn" class="alert alert-warning alert-dismissible fade show shadow-lg text-center mx-auto" style="width: 90%; max-width: 400px;" role="alert">
    <strong><i class="bi bi-x-circle-fill"></i> Anda sudah login!</strong> Silakan logout terlebih dahulu untuk kembali ke halaman login.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>

  <!-- Ikon larangan jika pengguna sudah login -->
  <div v-if="isLoggedIn" class="alert alert-danger text-center shadow-lg mx-auto" style="width: 90%; max-width: 400px;">
    <i class="bi bi-x-circle-fill text-danger" style="font-size: 3rem;"></i>
    <p class="text-danger mt-3">Akses Login Dibatasi, Silakan Logout Terlebih Dahulu</p>
  </div>
</template>

<script>
import axios from 'axios';
import { API_BASE_URL } from '../constant.js';

export default {
  name: "HomeView",
  data() {
    return {
      login: {
        username: '',
        password: ''
      },
      message: '',
      loading: false
    };
  },
  computed: {
    isLoggedIn() {
      // Cek apakah ada token di localStorage, menandakan pengguna sudah login
      return localStorage.getItem('access_token');
    }
  },
  methods: {

    handleLogin() {
      if (this.login.username == '') {
        this.message = 'Username tidak boleh kosong!';
      }
      if (this.login.password == '') {
        this.message = 'Password tidak boleh kosong!';
      }
      if (this.login.username != '' && this.login.password != '') {
        this.message = '';
        this.loading = true;
        this.sendData(this.login);
      }
    },
    sendData(payload) {
      let endpoint = API_BASE_URL + "/login";
      axios.post(endpoint, payload)
      .then(res => {
        // Simpan token/data user ke LocalStorage
        localStorage.setItem('user', JSON.stringify(res.data.data.user));
        localStorage.setItem('access_token',  res.data.data.access_token);
        // Redirect ke halaman profile
        this.$router.push('/profile');
      })
      .catch(err => {
        this.loading = false;
        this.message = err.response.data.message;
      });
    },
  }
};
</script>

<style scoped>
/* Gaya untuk ikon larangan */
.bi-x-circle-fill {
  color: red;
}

/* Animasi untuk alert */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Gaya untuk alert ketika sudah login */
.alert-warning {
  animation: slideIn 0.5s ease-out;
  border-left: 5px solid #f39c12;
  background-color: #fff9e6;
  color: #f39c12;
}

.alert-warning .btn-close {
  color: #f39c12;
}

/* Gaya untuk ikon */
.alert .bi {
  margin-right: 10px;
  font-size: 1.5rem;
}

/* Gaya untuk ikon larangan */
.bi-x-circle-fill {
  font-size: 3rem;
  margin-bottom: 20px;
}

/* Penyesuaian untuk center-alignment alert */
.alert.text-center {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  max-width: 400px;
  text-align: center;
  border-radius: 10px;
}

/* Gaya untuk alert "Akses Login Dibatasi" */
.alert-danger {
  animation: slideIn 0.5s ease-out;
  font-size: 1.2rem;
  padding: 2rem;
  border-radius: 10px;
}
</style>
