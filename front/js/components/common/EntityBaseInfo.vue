<template>
  <div v-if="entity != null && entity.id != null">
    <br />
    <br />
    <br />
    <h4>Informações adicionais</h4>
    <div class="form-row">
      <div class="form-group col-lg-4">
        <label>ID</label>
        <input
          type="text"
          class="form-control"
          :value="entity.id"
          placeholder
          readonly
        />
      </div>
      <div class="form-group col-lg-4" v-if="entity.createdAt">
        <label>Criado em</label>
        <input
          type="text"
          class="form-control"
          :value="`${moment(entity.createdAt).format('L LTS')} - ${moment(
            entity.createdAt
          ).fromNow()}`"
          placeholder
          readonly
        />
      </div>
      <div class="form-group col-lg-4" v-if="entity.updatedAt">
        <label>Modificado em</label>
        <input
          type="text"
          class="form-control"
          :value="`${moment(entity.updatedAt).format('L LTS')} - ${moment(
            entity.updatedAt
          ).fromNow()}`"
          placeholder
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';

  export default {
    props: ['entity'],
    methods: {
      moment(date) {
        return moment(date);
      },
    },
  };
</script>

<style scoped></style>
