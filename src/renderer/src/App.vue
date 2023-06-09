<template>
  <div class="layout-wrapper layout-content-navbar layout-without-menu">
    <div class="layout-container">
      <!-- Layout container -->
      <div class="layout-page">

        <!-- Content wrapper -->
        <div class="content-wrapper">
          <!-- Content -->

          <div class="container-xxl flex-grow-1 container-p-y">
            <!-- Layout Demo -->
            <router-view></router-view>
            <!--/ Layout Demo -->
          </div>
          <!-- / Content -->

          <div class="content-backdrop fade"></div>
        </div>
        <!-- Content wrapper -->
      </div>
      <!-- / Layout page -->
    </div>
  </div>
</template>