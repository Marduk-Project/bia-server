<template>
  <div class="flex-center position-ref full-height" id="pg-container">
    <div class="content">
      <div class="title">Ops... esta página foi movida ou não existe.</div>
      <br />
      <br />
      <a href="/">&rsaquo; Retornar para home</a>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style scoped>
  #pg-container {
    background-color: #fff;
    color: #636b6f;
    font-family: 'Raleway', sans-serif;
    font-weight: 100;
    height: 100vh;
    margin: 0;
  }

  .full-height {
    height: 100vh;
  }

  .flex-center {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .position-ref {
    position: relative;
  }

  .content {
    text-align: center;
  }

  .title {
    font-size: 36px;
    padding: 20px;
  }
</style>
