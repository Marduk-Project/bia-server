<template>
  <div class="container">
    <br />
    <h4 class="">Seja bem-vindo(a) ao portal de solicitações</h4>
    <div class="">
      <router-link
        class="btn btn-outline-secondary col-lg-4"
        tag="a"
        :to="{ name: 'or_order.index' }"
      >
        <i class="fas fa-clipboard-list"></i> Ver solicitações &amp; entregas
      </router-link>
    </div>
    <br />
    <br />
    <div>
      <h4>Entidades vinculadas como o seu usuário</h4>
      <p class="text-muted" v-if="personContactList.length == 0"
        >Seu usuário não possui entidades vinculadas. Entre em contato conosco
        para mais informações.</p
      >
      <table
        class="table table-hover table-striped"
        v-if="personContactList.length > 0"
      >
        <thead>
          <tr>
            <th>Nome da entidade</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="personContact in personContactList"
            :key="personContact.id"
          >
            <td>{{ personContact.person.name }}</td>
            <td class="text-right">
              <router-link
                v-b-tooltip.hover
                title="Ver consolidado de demandas abertas para esta entidade."
                tag="button"
                class="btn btn-sm btn-outline-secondary"
                :to="{
                  name: 'or_order_consolidated.index',
                  params: {
                    page: {
                      filters: { glPersonDestination: personContact.person },
                    },
                  },
                }"
              >
                <i class="fas fa-table"></i> Consolidado
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from '@mixins/axios-auth';
  // import { apiMixin } from '@mixins/api-mixin';
  import { mapState } from 'vuex';

  export default {
    // mixins: [apiMixin],
    computed: {
      ...mapState({
        personContactList: 'personContactList',
      }),
    },
    mounted() {
      this.$store.dispatch('setTitle', 'Dashboard');
    },
  };
</script>

<style scoped></style>
