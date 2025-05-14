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
    const isAuthenticated = ref(false);
    const isLoaded = ref(false);

    const checkAuth = () => {
      const token = localStorage.getItem('access_token');
      isAuthenticated.value = !!token; // True jika token ada
      return isAuthenticated.value;
    };

    onMounted(() => {
      isAuthenticated.value = checkAuth();
      isLoaded.value = true;
    });

    return { isAuthenticated, isLoaded };
  }
};
</script>
