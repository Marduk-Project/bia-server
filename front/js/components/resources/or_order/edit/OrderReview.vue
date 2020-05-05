<template>
  <div>
    <table class="table table-hover table-striped">
      <tbody>
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
          <th>Entidade responsável pela {{ entity.typeDesc }}</th>
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
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import PersonItem from '../../gl_person/PersonItem.vue';
  import PersonContactItem from '../../gl_person_contact/PersonContactItem.vue';

  export default {
    components: {
      'app-person-item': PersonItem,
      'app-person-contact-item': PersonContactItem,
    },
    props: {
      entity: {
        type: Object,
        default: () => ({
          glPersonOrigin: null,
          glPersonContactOrigin: null,
          glPersonDestination: null,
          glPersonContactDestination: null,
          items: [],
          notes: '',
        }),
      },
    },
    data() {
      return {};
    },
    computed: {},
  };
</script>
