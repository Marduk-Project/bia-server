<template>
  <b-container>
    <br />
    <b-button variant="link" @click="crud_navBack">
      <i class="fa fa-chevron-left" /> Voltar
    </b-button>
    <br />
    <h1>{{ crud_title }}</h1>
    <b-table hover :items="items">
      <template slot="amount" slot-scope="row">
        <b-form-group>
          <b-form-input
            type="number"
            v-model="row.item.value"
            min="0"
          ></b-form-input>
        </b-form-group>
      </template>
    </b-table>
  </b-container>
</template>

<script>
  import { crudMixin } from '@mixins/crud-mixin';
  export default {
    mixins: [crudMixin],
    data() {
      return {
        items: [
          { PPE: 'Avental', amount: 5 },
          { PPE: 'Gorro', amount: 5 },
          { PPE: 'Lençol', amount: 5 },
          { PPE: 'Luva', amount: 5 },
          { PPE: 'Máscara', amount: 5 },
          { PPE: 'Óculos', amount: 5 },
          { PPE: 'Pano', amount: 5 },
          { PPE: 'Protetor', amount: 5 },
        ],
      };
    },
  };
</script>

<style></style>
