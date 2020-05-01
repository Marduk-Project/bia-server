<template>
  <nav class="nav flex-column">
    <span class="nav-link nav-link-title">Sistema</span>
    <router-link
      class="nav-link"
      active-class="active"
      :to="{ name: 'maintenance.general' }"
      tag="a"
    >
      <i class="fas fa-tachometer-alt"></i> Geral
    </router-link>
    <router-link
      class="nav-link"
      active-class="active"
      :to="{ name: 'maintenance.importData' }"
      tag="a"
    >
      <i class="fas fa-exchange-alt"></i> Importar dados
    </router-link>
    <router-link
      class="nav-link"
      active-class="active"
      :to="{ name: 'config.edit' }"
      tag="a"
    >
      <i class="fas fa-cogs"></i> Editar
      <strong>configuração</strong>
    </router-link>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
nav .nav-link {
  color: rgba(0, 0, 0, 0.65);
  padding: 0.5rem 0rem;
}

.nav-link-title {
  color: rgba(0, 0, 0, 0.35) !important;
  margin-bottom: 0px;
  margin-top: 1.5em;
}

nav .nav-link:hover {
  color: rgba(0, 0, 0, 0.85);
}

nav .nav-link.active {
  color: rgba(0, 0, 0, 1);
  font-weight: 900;
}

nav .fa,
nav .svg,
nav .fas {
  width: 22px;
  text-align: center;
  margin-right: 2px;
}
</style>
