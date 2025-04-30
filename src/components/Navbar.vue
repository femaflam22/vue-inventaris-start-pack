<template>
  <nav class="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
    <div class="container-fluid">
      <!-- Logo / Brand -->
      <router-link to="/" class="navbar-brand text-dark fw-bold">INVENTARIS</router-link>

      <!-- Toggle Button for Mobile -->
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Navbar Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link text-dark">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/profile" class="nav-link text-dark">Profile</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/stuffs" class="nav-link text-dark">Stuffs</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/trash" class="nav-link text-dark">Trash</router-link>
          </li>
        </ul>

        <!-- Clock & Logout -->
        <div class="d-flex align-items-center gap-3">
          <div class="text-dark fw-medium small" style="min-width: 110px;">
            🕒 {{ clock }}
          </div>
          <button v-if="isLoggedIn" @click="logout" class="btn btn-outline-danger">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      clock: ""
    };
  },
  computed: {
    isLoggedIn() {
      return localStorage.getItem("access_token");
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      this.$router.push("/");
    },
    updateClock() {
      const now = new Date();

      // Konversi ke WIB (UTC+7)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const wib = new Date(utc + 7 * 3600000);

      const hours = wib.getHours().toString().padStart(2, "0");
      const minutes = wib.getMinutes().toString().padStart(2, "0");
      const seconds = wib.getSeconds().toString().padStart(2, "0");

      this.clock = `${hours}:${minutes}:${seconds}`;
    }
  },
  mounted() {
    this.updateClock();
    setInterval(this.updateClock, 1000);
  }
};
</script>

<style scoped>
.navbar-nav .nav-link.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
