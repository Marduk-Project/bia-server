<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12 col-md-4 col-xl-2">
        <br />
        <router-view name="menu"></router-view>
      </div>
      <div class="col-12 col-md-8 col-xl-10">
        <br />
        <router-view name="content"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      if (this.$store.getters.getUser) {
        if (!this.$store.getters.isUserAdmin) {
          this.$store.dispatch('notifyDanger', 'Não autorizado.');
          this.$router.push('/');
        }
      }
    },
  };
</script>

<style scoped></style>
