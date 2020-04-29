<template>
  <div class="jumbotron">
    <h4>Selecione a configuração</h4>
    <p class="lead text-danger">
      <strong>Atenção!</strong> Configurações erradas podem fazer o sistema
      parar de funcionar.
    </p>
  </div>
</template>

<script>
import axios from '@mixins/axios-auth'
import { apiMixin } from '@mixins/api-mixin'

export default {
  mixins: [apiMixin],
  data() {
    return {
      artisanCommand: '',
    }
  },
  mounted() {
    this.$store.dispatch('setTitle', 'Manutenção')
  },
}
</script>

<style scoped></style>
