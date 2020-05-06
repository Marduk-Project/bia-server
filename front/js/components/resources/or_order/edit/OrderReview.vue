<template>
  <div>
    <table class="table table-hover table-striped">
      <tbody>
        <tr>
          <th>Tipo de formulário</th>
          <td>{{ typeDesc }}</td>
        </tr>
        <tr>
          <th>Entidade de destino</th>
          <td
            ><app-person-item
              :entity="entity.glPersonDestination"
            ></app-person-item>
          </td>
        </tr>
        <tr>
          <th>Contato de destino</th>
          <td
            ><app-person-contact-item
              :entity="entity.glPersonContactDestination"
            ></app-person-contact-item>
          </td>
        </tr>
        <tr
          v-if="
            entity.glPersonOrigin &&
            entity.glPersonDestination &&
            entity.glPersonOrigin.id != entity.glPersonDestination.id
          "
        >
          <th>Entidade responsável pela {{ typeDesc }}</th>
          <td
            ><app-person-item :entity="entity.glPersonOrigin"></app-person-item>
          </td>
        </tr>
        <tr v-if="entity.glPersonContactOrigin">
          <th>Responsável pelas informações</th>
          <td
            ><app-person-contact-item
              :entity="entity.glPersonContactOrigin"
            ></app-person-contact-item>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="form-row">
      <div class="form-group col-lg-12">
        <label for="input-notes">
          Observações adicionais
        </label>
        <textarea
          class="form-control"
          @input="onNotesInput"
          :value="entity.notes"
          rows="2"
          maxlength="1000"
          placeholder="Descreva de recebimento, envio, produtos não encontrados ou o que julgar necessário."
        />
      </div>
    </div>
    <br />
    <h4>Produtos</h4>
    <div class="table-responsive">
      <table class="table table-hover table-striped">
        <thead>
          <tr>
            <th style="width: 60%;">Item</th>
            <th style="width: 15%;" class="text-right">Quantidade</th>
            <th style="width: 15%;">Unidade</th>
            <th style="width: 10%;" class="app-table-actions"
              ><app-info title="Informações"></app-info
            ></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="productData in entity.glProducts"
            :key="productData.glProductId"
          >
            <td
              v-b-tooltip.hover
              :title="productData.glProduct.description"
              style="word-wrap: break-word;"
              >{{ productData.glProduct.name }}</td
            >
            <td class="text-right">
              {{ productData.quantity }}
            </td>
            <td>
              {{ productData.glUnit.name }}
            </td>
            <td class="app-table-actions">
              <i
                v-if="productData.notes"
                class="app-table-action fas fa-comment text-info"
                v-b-tooltip.hover
                :title="productData.notes"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PersonItem from '../../gl_person/PersonItem.vue';
  import PersonContactItem from '../../gl_person_contact/PersonContactItem.vue';

  import { mixin } from '../order_api';

  export default {
    mixins: [mixin],
    components: {
      'app-person-item': PersonItem,
      'app-person-contact-item': PersonContactItem,
    },
    props: {
      entity: {
        type: Object,
        default: () => ({
          type: 0,
          glPersonOrigin: null,
          glPersonContactOrigin: null,
          glPersonDestination: null,
          glPersonContactDestination: null,
          glProducts: [],
          notes: '',
        }),
      },
    },
    watch: {
      entity(newValue) {
        this.notes = newValue.notes;
      },
    },
    methods: {
      onNotesInput(event) {
        this.$emit('onNotesUpdate', event.target.value);
      },
    },
  };
</script>
