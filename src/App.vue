<template>
  <Navbar v-if="isAuthenticated" />
  <!-- @yield -->
  <router-view v-if="isLoaded" />
</template>

<script>
import Navbar from "./components/Navbar.vue";
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';

export default {
  name: "App",
  components: {
    Navbar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isAuthenticated = ref(false);
    const isLoaded = ref(false);

    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      isAuthenticated.value = !!token; // True jika token ada
      return isAuthenticated.value;
    };

    const handleNavigation = () => {
      const isAuth = checkAuth();

      // Jika tidak terautentikasi dan mencoba mengakses halaman selain login atau register
      if (!isAuth && route.path !== '/') {
        router.replace('/');  // Mengarahkan ke halaman register
      }
    };

    onMounted(() => {
      isAuthenticated.value = checkAuth();
      isLoaded.value = true;
      handleNavigation(); // Cek saat pertama kali aplikasi dimuat
    });

    watch(route, () => {
      handleNavigation(); // Cek ulang setiap kali rute berubah
    });

    return { isAuthenticated, isLoaded };
  }
};
</script>
