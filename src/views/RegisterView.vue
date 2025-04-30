<template>
    <!-- Memanggil event dengan @ -->
    <form class="card d-block mx-auto w-50 p-5 my-5" @submit.prevent="handleRegister">
      <div class="alert alert-danger" v-if="message">{{ message }}</div>
      <div class="alert alert-info" v-if="loading">Sedang melakukan register akun anda...</div>
      
      <!-- Input Email -->
      <div class="mb-3">
        <label for="exampleInputEmail" class="form-label">Email</label>
        <input type="email" class="form-control" id="exampleInputEmail" aria-describedby="emailHelp" 
          v-model="register.email" required>
      </div>
      
      <!-- Input Username -->
      <div class="mb-3">
        <label for="exampleInputUsername" class="form-label">Username</label>
        <input type="text" class="form-control" id="exampleInputUsername" aria-describedby="usernameHelp" 
          v-model="register.username" required>
      </div>
  
      <!-- Input Password -->
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1" v-model="register.password" required>
      </div>
  
      <button type="submit" class="btn btn-primary" :disabled="loading">Register</button>
      
      <div class="mt-3">
        <p>Sudah Punya Akun? <button type="button" @click="goToLogin" class="btn btn-link p-0">Login</button></p>
      </div>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  import { API_BASE_URL } from '../constant.js';
  
  export default {
    name: "RegisterView",
    data() {
      return {
        register: {
          email: '',  // Menambahkan email ke data
          username: '',
          password: ''
        },
        message: '',
        loading: false
      };
    },
    methods: {
      handleRegister() {
        // Validasi input email, username, dan password
        if (this.register.email == '') {
          this.message = 'Email tidak boleh kosong!';
        } else if (this.register.username == '') {
          this.message = 'Username tidak boleh kosong!';
        } else if (this.register.password == '') {
          this.message = 'Password tidak boleh kosong!';
        }
  
        if (this.register.email != '' && this.register.username != '' && this.register.password != '') {
          this.message = '';
          this.loading = true;
          this.sendData(this.register);
        }
      },
  
      sendData(payload) {
        let endpoint = API_BASE_URL + "/register";
        axios.post(endpoint, payload)
          .then(res => {
            // Redirect ke halaman profile
            this.$router.push('/');
          })
          .catch(err => {
            this.loading = false;
            this.message = err.response.data.message;
          });
      },
  
      goToLogin() {
        // Arahkan pengguna ke halaman login
        this.$router.push('/');
      }
    }
  };
  </script>
  