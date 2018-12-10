<template>
  <div class="s-card">
    <p class="card-title">{{title}}</p>
    <div class="card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 's-card',
  props: {
    title: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .s-card {
    .card-title {
      margin: 0;
      &::before, &::after {
        content: '\02022';
        margin: 10px;
      }
    }
    .card-body {
      margin: 20px 0 40px;
      background-color: #fff;
      border-radius: 5px;
      padding: 20px 10px;
      color: #333;
    }
  }
</style>
