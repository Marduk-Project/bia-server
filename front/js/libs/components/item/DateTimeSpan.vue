<template>
  <span v-if="value" v-b-tooltip.hover :title="moment(value).format('L LTS')">
    <span class="d-print-none"> {{ moment(value).fromNow() }}
      <i v-if="modDate" class="fa fa-info-circle" v-b-tooltip :title="`Modificado em ${moment(modDate).format('L LTS')} - ${moment(modDate)}`"></i>
      <i v-if="createdDate" class="fa fa-info-circle" v-b-tooltip :title="`Criado em ${moment(createdDate).format('L LTS')} - ${moment(createdDate).fromNow()}`"></i>
    </span>
    <span class="d-print-inline d-none">{{ moment(value).format('L LTS') }}</span>
  </span>
</template>

<script>
  import moment from 'moment';

  export default {
    props: [
      'value',
      'modDate',
      'createdDate',
    ],
    methods: {
      moment(value) {
        return moment(value);
      }
    }
  }
</script>

<style scoped>

</style>