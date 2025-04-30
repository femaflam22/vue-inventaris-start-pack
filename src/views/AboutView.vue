<template>
  <div class="about container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <!-- Judul Halaman dengan animasi fade-in -->
        <h1 class="display-4 text-primary mb-4 animate__animated animate__fadeIn">About Me</h1>
        
        <!-- Card dengan animasi slide-in -->
        <div class="card shadow-sm mb-4 animate__animated animate__fadeInUp animate__delay-1s">
          <div class="card-body">
            <h3 class="card-title mb-4">User Information</h3>
            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between animate__animated animate__fadeInUp">
                <strong>Username:</strong> <span>{{ user.username }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between animate__animated animate__fadeInUp">
                <strong>Email:</strong> <span>{{ user.email }}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between animate__animated animate__fadeInUp">
                <strong>Status:</strong> 
                <span :class="{'text-success': user.status, 'text-danger': !user.status}">
                  {{ user.status ? 'Aktif' : 'Non-aktif' }}
                </span>
              </li>
              <li class="list-group-item d-flex justify-content-between animate__animated animate__fadeInUp">
                <strong>Role:</strong> <span>{{ user.role }}</span>
              </li>
            </ul>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import { USER } from '../constant.js';

export default {
  name: "AboutView",
  data() {
    return {
      user: USER
    };
  }
};
</script>

<style scoped>
.about {
  background-color: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

.card {
  border-radius: 10px;
  animation: slideIn 1s ease-out;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
}

.list-group-item {
  font-size: 1.1rem;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px 20px;
  opacity: 0;
  animation: fadeInUp 0.5s forwards;
}

.list-group-item strong {
  color: #333;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

h1.display-4 {
  font-weight: 600;
  color: #007bff;
}

ul.list-group {
  padding-left: 0;
  list-style-type: none;
}

ul.list-group li {
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Animations */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
